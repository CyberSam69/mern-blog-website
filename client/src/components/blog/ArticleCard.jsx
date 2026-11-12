import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Icon from '../common/Icon';
import './ArticleCard.css';

export default function ArticleCard({
  post,
  variant = 'default', // 'default' | 'horizontal' | 'hero' | 'compact'
  className = '',
}) {
  if (!post) return null;

  const {
    title,
    slug,
    excerpt,
    category,
    categorySlug,
    author,
    featuredImage,
    publishedAt,
    readTime,
  } = post;

  const authorName = author?.name || 'FlyerTech Editorial';
  const authorRole = author?.role || 'Staff Writer';
  const authorAvatar = author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  // Fallback image handler
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
  };

  // Variant: Compact (Sidebar / Trending List)
  if (variant === 'compact') {
    return (
      <article className={`article-card card-compact ${className}`}>
        <div className="compact-body">
          <div className="card-meta">
            <Link to={`/blogs?category=${categorySlug}`} className="card-category-link">
              <Badge variant="blue" size="sm">{category}</Badge>
            </Link>
            <span className="meta-text">{formattedDate}</span>
          </div>
          <h4 className="compact-title">
            <Link to={`/blog/${slug}`} className="card-title-link">
              {title}
            </Link>
          </h4>
          <div className="compact-footer">
            <span className="author-name-sm">{authorName}</span>
            <span className="meta-dot">•</span>
            <span className="read-time-sm">{readTime || '5 min read'}</span>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Hero (Main Featured Showcase)
  if (variant === 'hero') {
    return (
      <article className={`article-card card-hero ${className}`}>
        <div className="hero-image-wrap">
          <Link to={`/blog/${slug}`} tabIndex={-1}>
            <img
              src={featuredImage}
              alt={title}
              className="hero-image"
              loading="eager"
              onError={handleImageError}
            />
          </Link>
        </div>
        <div className="hero-content">
          <div className="card-meta">
            <Link to={`/blogs?category=${categorySlug}`} className="card-category-link">
              <Badge variant="blue" size="md">{category}</Badge>
            </Link>
            <span className="meta-item">
              <Icon name="calendar" size={14} color="var(--text-secondary)" />
              <span>{formattedDate}</span>
            </span>
            <span className="meta-item">
              <Icon name="clock" size={14} color="var(--text-secondary)" />
              <span>{readTime || '5 min read'}</span>
            </span>
          </div>

          <h2 className="hero-title">
            <Link to={`/blog/${slug}`} className="card-title-link">
              {title}
            </Link>
          </h2>

          <p className="hero-excerpt">{excerpt}</p>

          <div className="card-author-block">
            <img src={authorAvatar} alt={authorName} className="author-avatar" onError={handleImageError} />
            <div className="author-info">
              <span className="author-name">{authorName}</span>
              <span className="author-role">{authorRole}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Horizontal (Split Layout)
  if (variant === 'horizontal') {
    return (
      <article className={`article-card card-horizontal ${className}`}>
        <div className="horizontal-image-wrap">
          <Link to={`/blog/${slug}`} tabIndex={-1}>
            <img
              src={featuredImage}
              alt={title}
              className="horizontal-image"
              loading="lazy"
              onError={handleImageError}
            />
          </Link>
        </div>
        <div className="horizontal-content">
          <div className="card-meta">
            <Link to={`/blogs?category=${categorySlug}`} className="card-category-link">
              <Badge variant="blue" size="sm">{category}</Badge>
            </Link>
            <span className="meta-text">{formattedDate}</span>
            <span className="meta-dot">•</span>
            <span className="meta-text">{readTime || '5 min read'}</span>
          </div>

          <h3 className="horizontal-title">
            <Link to={`/blog/${slug}`} className="card-title-link">
              {title}
            </Link>
          </h3>

          <p className="card-excerpt">{excerpt}</p>

          <div className="card-author-block">
            <img src={authorAvatar} alt={authorName} className="author-avatar-sm" onError={handleImageError} />
            <span className="author-name-sm">{authorName}</span>
          </div>
        </div>
      </article>
    );
  }

  // Default: Grid Card
  return (
    <article className={`article-card card-default ${className}`}>
      <div className="card-image-wrap">
        <Link to={`/blog/${slug}`} tabIndex={-1}>
          <img
            src={featuredImage}
            alt={title}
            className="card-image"
            loading="lazy"
            onError={handleImageError}
          />
        </Link>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <Link to={`/blogs?category=${categorySlug}`} className="card-category-link">
            <Badge variant="blue" size="sm">{category}</Badge>
          </Link>
          <span className="meta-text">{formattedDate}</span>
        </div>

        <h3 className="card-title">
          <Link to={`/blog/${slug}`} className="card-title-link">
            {title}
          </Link>
        </h3>

        <p className="card-excerpt">{excerpt}</p>

        <div className="card-footer">
          <div className="card-author-block">
            <img src={authorAvatar} alt={authorName} className="author-avatar-sm" onError={handleImageError} />
            <div className="author-text">
              <span className="author-name-sm">{authorName}</span>
            </div>
          </div>
          <span className="read-time-pill">
            <Icon name="clock" size={12} color="var(--text-light)" />
            <span>{readTime || '5 min read'}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

