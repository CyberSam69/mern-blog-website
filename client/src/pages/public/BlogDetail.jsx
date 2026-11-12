import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ArticleCard from '../../components/blog/ArticleCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { MOCK_BLOGS } from '../../utils/mockBlogs';
import './BlogDetail.css';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Find post by slug
  const postIndex = MOCK_BLOGS.findIndex((p) => p.slug === slug);
  const post = postIndex !== -1 ? MOCK_BLOGS[postIndex] : null;

  // Previous and next article navigation
  const prevPost = postIndex > 0 ? MOCK_BLOGS[postIndex - 1] : null;
  const nextPost = postIndex < MOCK_BLOGS.length - 1 ? MOCK_BLOGS[postIndex + 1] : null;

  // Related articles (from same category or remaining posts)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return MOCK_BLOGS
      .filter((p) => p.id !== post.id && (p.categorySlug === post.categorySlug || p.isTrending))
      .slice(0, 3);
  }, [post]);

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
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" via FlyerTech:`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  if (!post) {
    return (
      <Layout>
        <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
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

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
                <img src={post.author.avatar} alt={post.author.name} className="author-detail-avatar" />
                <div className="author-detail-text">
                  <span className="author-detail-name">{post.author.name}</span>
                  <span className="author-detail-role">{post.author.role}</span>
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
          <img src={post.featuredImage} alt={post.title} className="article-featured-image" />
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
              <img src={post.author.avatar} alt={post.author.name} className="bio-avatar" />
              <div className="bio-text">
                <span className="bio-written">Written by</span>
                <h4 className="bio-name">{post.author.name}</h4>
                <p className="bio-role">{post.author.role} at FlyerTech Editorial</p>
                <p className="bio-desc">
                  Specializing in distributed systems, resilient cloud infrastructure, and enterprise software engineering practices.
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
                  <ArticleCard key={relPost.id} post={relPost} variant="default" />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
