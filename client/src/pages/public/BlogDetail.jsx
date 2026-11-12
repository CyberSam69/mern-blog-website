import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ArticleCard from '../../components/blog/ArticleCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { fetchArticleBySlug } from '../../utils/blogService';
import './BlogDetail.css';

export default function BlogDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Scroll to top and fetch post whenever slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;

    async function loadPost() {
      setLoading(true);
      const res = await fetchArticleBySlug(slug);
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    }

    loadPost();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const post = data?.article;
  const relatedPosts = data?.relatedPosts || [];
  const prevPost = data?.prevPost;
  const nextPost = data?.nextPost;

  // Extract Table of Contents items from HTML headings
  const tocItems = useMemo(() => {
    if (!post?.content) return [];
    const regex = /<h2[^>]*>(.*?)<\/h2>/g;
    const items = [];
    let match;
    while ((match = regex.exec(post.content)) !== null) {
      const headingText = match[1].replace(/<[^>]+>/g, '');
      const headingId = headingText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      items.push({ text: headingText, id: headingId });
    }
    return items;
  }, [post]);

  // Inject IDs into content headings so TOC links jump smoothly
  const processedContent = useMemo(() => {
    if (!post?.content) return '';
    return post.content.replace(/<h2[^>]*>(.*?)<\/h2>/g, (orig, title) => {
      const cleanText = title.replace(/<[^>]+>/g, '');
      const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return `<h2 id="${id}">${title}</h2>`;
    });
  }, [post]);

  const handleCopyLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // ignore
    }
  };

  const handleShareTwitter = () => {
    if (!post) return;
    const text = encodeURIComponent(`"${post.title}" via FlyerTech:`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading technical article...</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2>Article Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 'var(--spacing-md) 0' }}>
            The requested article could not be located in our editorial archives.
          </p>
          <Link to="/blogs">
            <Button variant="primary">Browse All Articles</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <Layout>
      <div className="blog-detail-page">
        {/* Breadcrumb Navigation */}
        <div className="detail-breadcrumb-bar">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="crumb-sep">/</span>
              <Link to="/blogs">Articles</Link>
              <span className="crumb-sep">/</span>
              <Link to={`/blogs?category=${post.categorySlug}`}>{post.category}</Link>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <header className="article-header-section">
          <div className="container article-header-container">
            <div className="article-header-meta">
              <Link to={`/blogs?category=${post.categorySlug}`}>
                <Badge variant="blue" size="md">{post.category}</Badge>
              </Link>
              <span className="meta-item">
                <Icon name="calendar" size={14} color="var(--text-secondary)" />
                <span>Published {formattedDate}</span>
              </span>
              <span className="meta-item">
                <Icon name="clock" size={14} color="var(--text-secondary)" />
                <span>{post.readTime}</span>
              </span>
            </div>

            <h1 className="article-main-title">{post.title}</h1>
            <p className="article-main-excerpt">{post.excerpt}</p>

            {/* Author bar & Social share */}
            <div className="article-author-share-bar">
              <div className="author-detail-block">
                <img
                  src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={post.author?.name || 'FlyerTech Author'}
                  className="author-detail-avatar"
                  onError={handleImageError}
                />
                <div className="author-detail-text">
                  <span className="author-detail-name">{post.author?.name || 'FlyerTech Editorial'}</span>
                  <span className="author-detail-role">{post.author?.role || 'Staff Writer'}</span>
                </div>
              </div>

              {/* Social sharing buttons */}
              <div className="social-sharing-group">
                <span className="share-label">Share:</span>
                <button
                  type="button"
                  className="social-btn"
                  onClick={handleShareTwitter}
                  title="Share on X / Twitter"
                  aria-label="Share on Twitter"
                >
                  X
                </button>
                <button
                  type="button"
                  className="social-btn"
                  onClick={handleShareLinkedIn}
                  title="Share on LinkedIn"
                  aria-label="Share on LinkedIn"
                >
                  in
                </button>
                <button
                  type="button"
                  className="social-btn copy-btn"
                  onClick={handleCopyLink}
                  title="Copy link to clipboard"
                  aria-label="Copy article link"
                >
                  <Icon name="share" size={14} />
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="container article-hero-image-wrap">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="article-featured-image"
            onError={handleImageError}
          />
        </div>

        {/* Main Article Body + Table of Contents Layout */}
        <div className="container article-body-layout">
          {/* Left / Center: Article Content */}
          <article className="article-prose-container">
            <div
              className="article-rich-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Tags row */}
            {post.tags && post.tags.length > 0 && (
              <div className="article-tags-row">
                <span className="tags-label">Categorized under:</span>
                {post.tags.map((tag, idx) => (
                  <Badge key={idx} variant="gray" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Author Bio Box */}
            <div className="author-bio-card">
              <img
                src={post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={post.author?.name || 'FlyerTech Author'}
                className="bio-avatar"
                onError={handleImageError}
              />
              <div className="bio-text">
                <span className="bio-written">Written by</span>
                <h4 className="bio-name">{post.author?.name || 'FlyerTech Editorial'}</h4>
                <p className="bio-role">{post.author?.role || 'Staff Writer'} at FlyerTech Editorial</p>
                <p className="bio-desc">
                  {post.author?.bio || 'Specializing in distributed systems, resilient cloud infrastructure, and enterprise software engineering practices.'}
                </p>
              </div>
            </div>

            {/* Prev / Next Article Navigation */}
            <nav className="article-prev-next-nav" aria-label="Previous and Next Article Navigation">
              {prevPost ? (
                <Link to={`/blog/${prevPost.slug}`} className="nav-card prev-card">
                  <span className="nav-direction">
                    <Icon name="arrow-left" size={14} />
                    <span>Previous Article</span>
                  </span>
                  <span className="nav-title">{prevPost.title}</span>
                </Link>
              ) : (
                <div className="nav-card empty-card" />
              )}

              {nextPost ? (
                <Link to={`/blog/${nextPost.slug}`} className="nav-card next-card">
                  <span className="nav-direction">
                    <span>Next Article</span>
                    <Icon name="arrow-right" size={14} />
                  </span>
                  <span className="nav-title">{nextPost.title}</span>
                </Link>
              ) : (
                <div className="nav-card empty-card" />
              )}
            </nav>
          </article>

          {/* Right: Sticky Table of Contents Sidebar */}
          {tocItems.length > 0 && (
            <aside className="article-toc-sidebar">
              <div className="toc-card sticky-toc">
                <h4 className="toc-title">Table of Contents</h4>
                <ul className="toc-list">
                  {tocItems.map((item, idx) => (
                    <li key={idx}>
                      <a href={`#${item.id}`} className="toc-link">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="toc-divider" />

                <div className="toc-quick-actions">
                  <button
                    type="button"
                    className="toc-action-btn"
                    onClick={handleCopyLink}
                  >
                    <Icon name="share" size={14} />
                    <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
                  </button>
                  <button
                    type="button"
                    className="toc-action-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    ↑ Back to Top
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="related-articles-section">
            <div className="container">
              <div className="related-header">
                <div>
                  <span className="section-eyebrow">Continue Reading</span>
                  <h2 className="section-title">Related Technical Articles</h2>
                </div>
                <Link to="/blogs" className="section-link">
                  Explore full catalogue →
                </Link>
              </div>

              <div className="related-grid">
                {relatedPosts.map((relPost) => (
                  <ArticleCard key={relPost.id || relPost._id} post={relPost} variant="default" />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
