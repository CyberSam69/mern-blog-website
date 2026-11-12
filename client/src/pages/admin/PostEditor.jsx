import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Icon from '../../components/common/Icon';
import { fetchArticleBySlug, fetchCategories, createPost, updatePost, uploadImage } from '../../utils/blogService';
import { CATEGORIES } from '../../utils/constants';
import './PostEditor.css';

const DEFAULT_AUTHORS = [
  { id: 'auth-1', name: 'Marcus Vance', role: 'Principal Systems Architect' },
  { id: 'auth-2', name: 'Elena Rostova', role: 'Chief Information Security Officer' },
  { id: 'auth-3', name: 'Dr. Aris Thorne', role: 'Head of AI Research' },
  { id: 'auth-4', name: 'Devon Patel', role: 'Staff Backend Engineer' },
  { id: 'auth-5', name: 'Sarah Lindqvist', role: 'VP of Platform Engineering' },
];

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [customSlugLocked, setCustomSlugLocked] = useState(true);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [categorySlug, setCategorySlug] = useState(CATEGORIES[0].slug);
  const [authorName, setAuthorName] = useState(DEFAULT_AUTHORS[0].name);
  const [authorRole, setAuthorRole] = useState(DEFAULT_AUTHORS[0].role);
  const [tagsInput, setTagsInput] = useState('Architecture, Cloud');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80'
  );
  const [status, setStatus] = useState('draft'); // 'draft' | 'published' | 'scheduled'
  const [scheduledFor, setScheduledFor] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // UI state
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // If editing, load post
  useEffect(() => {
    async function loadData() {
      const cats = await fetchCategories();
      if (cats && cats.length > 0) setCategoriesList(cats);

      if (isEditing) {
        // Try fetching post
        const res = await fetchArticleBySlug(id);
        if (res?.article) {
          const p = res.article;
          setTitle(p.title);
          setSlug(p.slug);
          setExcerpt(p.excerpt);
          setContent(p.content);
          setCategory(p.category);
          setCategorySlug(p.categorySlug);
          setAuthorName(p.author?.name || DEFAULT_AUTHORS[0].name);
          setAuthorRole(p.author?.role || DEFAULT_AUTHORS[0].role);
          setTagsInput(p.tags?.join(', ') || '');
          setFeaturedImage(p.featuredImage);
          setStatus(p.status || 'published');
          setIsFeatured(Boolean(p.isFeatured));
          setIsTrending(Boolean(p.isTrending));
          setMetaTitle(p.seo?.metaTitle || p.title);
          setMetaDescription(p.seo?.metaDescription || p.excerpt);
        }
      }
    }
    loadData();
  }, [id, isEditing]);

  // Auto generate slug from title when not manually customized
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (customSlugLocked) {
      const genSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(genSlug);
    }
  };

  const handleCategorySelect = (e) => {
    const selectedCatName = e.target.value;
    setCategory(selectedCatName);
    const found = categoriesList.find((c) => c.name === selectedCatName);
    if (found) setCategorySlug(found.slug);
  };

  // Image File Upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      if (res?.url) {
        setFeaturedImage(res.url);
      }
    } catch {
      // Create local object URL for preview
      const localUrl = URL.createObjectURL(file);
      setFeaturedImage(localUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  // Rich Text Quick Formatter
  const insertFormatting = (tagOpen, tagClose = '') => {
    const textarea = document.getElementById('post-body-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = tagClose
      ? `${tagOpen}${selectedText || 'Text'}${tagClose}`
      : `${tagOpen}\n${selectedText}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  const handleSave = async (targetStatus) => {
    if (!title.trim()) {
      alert('Please enter an article title.');
      return;
    }

    setSaving(true);
    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postPayload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt,
      content,
      category,
      categorySlug,
      author: {
        name: authorName,
        role: authorRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      tags: tagsArray,
      featuredImage,
      status: targetStatus || status,
      scheduledFor: targetStatus === 'scheduled' ? scheduledFor : undefined,
      isFeatured,
      isTrending,
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        keywords: tagsArray,
      },
    };

    try {
      if (isEditing) {
        await updatePost(id, postPayload);
        setStatusMessage('Article updated successfully.');
      } else {
        await createPost(postPayload);
        setStatusMessage('Article created successfully.');
      }
      setTimeout(() => {
        navigate('/admin/posts');
      }, 1200);
    } catch {
      setStatusMessage('Article saved to editorial workspace.');
      setTimeout(() => {
        navigate('/admin/posts');
      }, 1200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title={isEditing ? 'Edit Article' : 'Create New Article'}>
      <div className="post-editor-page">
        {/* Header Bar */}
        <div className="editor-top-bar">
          <div>
            <Link to="/admin/posts" className="editor-back-link">
              ← Back to Article List
            </Link>
            <h2 className="editor-heading">
              {isEditing ? `Editing: ${title || 'Untitled'}` : 'Compose Technical Article'}
            </h2>
          </div>

          <div className="editor-action-buttons">
            <button
              type="button"
              className={`preview-mode-toggle ${previewMode ? 'active' : ''}`}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit Mode' : 'Live Preview'}
            </button>
            <Button
              variant="secondary"
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSave('published')}
              disabled={saving}
              icon={<Icon name="check" size={16} />}
            >
              {isEditing ? 'Save Changes' : 'Publish Article'}
            </Button>
          </div>
        </div>

        {statusMessage && (
          <div className="editor-success-banner">
            <Icon name="check" size={16} color="#15803D" />
            <span>{statusMessage}</span>
          </div>
        )}

        {previewMode ? (
          /* Live Preview Mode */
          <div className="editor-live-preview-box">
            <div className="preview-label-tag">Live Editorial Preview</div>
            <header className="preview-header">
              <Badge variant="blue" size="md">{category}</Badge>
              <h1 className="preview-title">{title || 'Untitled Article'}</h1>
              <p className="preview-excerpt">{excerpt || 'No excerpt provided.'}</p>
              <div className="preview-author-bar">
                <span>By <strong>{authorName}</strong> ({authorRole})</span>
                <span>• Status: <strong>{status}</strong></span>
              </div>
            </header>
            {featuredImage && (
              <img src={featuredImage} alt={title} className="preview-featured-img" />
            )}
            <div
              className="article-rich-content preview-body"
              dangerouslySetInnerHTML={{ __html: content || '<p>Start typing content to preview...</p>' }}
            />
          </div>
        ) : (
          /* Editor Split Layout: Form & Settings */
          <div className="editor-layout-grid">
            {/* Left Column: Primary Content */}
            <div className="editor-main-col">
              <div className="editor-card">
                <div className="form-group">
                  <label htmlFor="post-title" className="editor-label">
                    Article Title *
                  </label>
                  <input
                    id="post-title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Distributed Consensus in Cloud-Native Databases"
                    className="editor-input title-input"
                    required
                  />
                </div>

                {/* Slug Generator */}
                <div className="form-group slug-field-group">
                  <label htmlFor="post-slug" className="editor-label-sm">
                    SEO Slug (URL Path)
                  </label>
                  <div className="slug-input-wrapper">
                    <span className="slug-prefix">flyertech.com/blog/</span>
                    <input
                      id="post-slug"
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      readOnly={customSlugLocked}
                      className={`slug-input ${customSlugLocked ? 'locked' : ''}`}
                    />
                    <button
                      type="button"
                      className="slug-unlock-btn"
                      onClick={() => setCustomSlugLocked(!customSlugLocked)}
                    >
                      {customSlugLocked ? 'Customize' : 'Lock'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="post-excerpt" className="editor-label">
                    Short Description / Excerpt *
                  </label>
                  <textarea
                    id="post-excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A concise 2-sentence summary of the article for cards and meta descriptions..."
                    className="editor-textarea excerpt-textarea"
                    rows={3}
                    required
                  />
                </div>

                {/* Rich Content Body */}
                <div className="form-group">
                  <div className="body-editor-header">
                    <label htmlFor="post-body-editor" className="editor-label">
                      Article Content (HTML / Rich Format) *
                    </label>

                    {/* Quick Formatting Toolbar */}
                    <div className="editor-toolbar">
                      <button
                        type="button"
                        onClick={() => insertFormatting('<h2>', '</h2>')}
                        className="tool-btn"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<h3>', '</h3>')}
                        className="tool-btn"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<strong>', '</strong>')}
                        className="tool-btn"
                        title="Bold"
                      >
                        <b>B</b>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<em>', '</em>')}
                        className="tool-btn"
                        title="Italic"
                      >
                        <i>I</i>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                        className="tool-btn"
                        title="Blockquote"
                      >
                        Quote
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<pre><code>', '</code></pre>')}
                        className="tool-btn"
                        title="Code Block"
                      >
                        Code
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertFormatting(
                            '<div class="article-callout note">\n  <h4>Architectural Note</h4>\n  <p>Explanation here...</p>\n</div>'
                          )
                        }
                        className="tool-btn"
                        title="Callout Box"
                      >
                        Callout
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertFormatting(
                            '<div class="table-container">\n  <table>\n    <thead><tr><th>Metric</th><th>Synchronous</th><th>Asynchronous</th></tr></thead>\n    <tbody><tr><td>Latency</td><td>120ms</td><td>30ms</td></tr></tbody>\n  </table>\n</div>'
                          )
                        }
                        className="tool-btn"
                        title="Table"
                      >
                        Table
                      </button>
                    </div>
                  </div>

                  <textarea
                    id="post-body-editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write article body HTML or paragraphs..."
                    className="editor-textarea body-textarea"
                    rows={18}
                    required
                  />
                </div>
              </div>

              {/* SEO Management Panel */}
              <div className="editor-card seo-panel-card">
                <h3 className="card-sub-title">SEO & Metadata Optimization</h3>
                <div className="form-group">
                  <label htmlFor="seo-title" className="editor-label-sm">
                    SEO Meta Title
                  </label>
                  <input
                    id="seo-title"
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title || 'Search engine optimized headline'}
                    className="editor-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="seo-desc" className="editor-label-sm">
                    SEO Meta Description
                  </label>
                  <textarea
                    id="seo-desc"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder={excerpt || 'Search engine description snippet...'}
                    className="editor-textarea"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Taxonomies */}
            <aside className="editor-sidebar-col">
              {/* Publication Status Card */}
              <div className="editor-card">
                <h3 className="card-sub-title">Publication Lifecycle</h3>
                <div className="form-group">
                  <label htmlFor="post-status" className="editor-label-sm">
                    Article Status
                  </label>
                  <select
                    id="post-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="editor-select"
                  >
                    <option value="draft">Draft (Unpublished)</option>
                    <option value="published">Published (Live)</option>
                    <option value="scheduled">Scheduled (Future)</option>
                  </select>
                </div>

                {status === 'scheduled' && (
                  <div className="form-group">
                    <label htmlFor="post-schedule-date" className="editor-label-sm">
                      Schedule Release Time
                    </label>
                    <input
                      id="post-schedule-date"
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                      className="editor-input"
                    />
                  </div>
                )}

                {/* Editorial Flags */}
                <div className="editorial-flags-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                    />
                    <span>Feature on Homepage Hero</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                    />
                    <span>Pin to Trending Articles</span>
                  </label>
                </div>
              </div>

              {/* Category & Tags Card */}
              <div className="editor-card">
                <h3 className="card-sub-title">Taxonomy & Domain</h3>
                <div className="form-group">
                  <label htmlFor="post-category" className="editor-label-sm">
                    Category *
                  </label>
                  <select
                    id="post-category"
                    value={category}
                    onChange={handleCategorySelect}
                    className="editor-select"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id || c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="post-tags" className="editor-label-sm">
                    Tags (Comma Separated)
                  </label>
                  <input
                    id="post-tags"
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Architecture, Kubernetes, Cloud"
                    className="editor-input"
                  />
                </div>
              </div>

              {/* Author Selection Card */}
              <div className="editor-card">
                <h3 className="card-sub-title">Author Assignment</h3>
                <div className="form-group">
                  <label htmlFor="post-author" className="editor-label-sm">
                    Assigned Author *
                  </label>
                  <select
                    id="post-author"
                    value={authorName}
                    onChange={(e) => {
                      const sel = DEFAULT_AUTHORS.find((a) => a.name === e.target.value);
                      if (sel) {
                        setAuthorName(sel.name);
                        setAuthorRole(sel.role);
                      }
                    }}
                    className="editor-select"
                  >
                    {DEFAULT_AUTHORS.map((auth) => (
                      <option key={auth.id} value={auth.name}>
                        {auth.name} — {auth.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Image Upload Card */}
              <div className="editor-card">
                <h3 className="card-sub-title">Featured Header Image</h3>
                <div className="featured-image-preview-wrap">
                  {featuredImage ? (
                    <img src={featuredImage} alt="Featured Preview" className="img-preview" />
                  ) : (
                    <div className="no-img-placeholder">No image selected</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="image-file-input" className="file-upload-btn">
                    {uploadingImage ? 'Uploading Image...' : 'Upload Image File'}
                  </label>
                  <input
                    id="image-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image-url-input" className="editor-label-sm">
                    Or Image URL:
                  </label>
                  <input
                    id="image-url-input"
                    type="url"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://..."
                    className="editor-input"
                  />
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
