import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ArticleCard from '../../components/blog/ArticleCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Icon from '../../components/common/Icon';
import { CATEGORIES } from '../../utils/constants';
import { MOCK_BLOGS } from '../../utils/mockBlogs';
import './Home.css';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const featuredPosts = MOCK_BLOGS.filter((post) => post.isFeatured);
  const primaryFeatured = featuredPosts[0] || MOCK_BLOGS[0];
  const secondaryFeatured = featuredPosts.slice(1);
  const trendingPosts = MOCK_BLOGS.filter((post) => post.isTrending);

  // Filter latest articles by selected category on the home page
  const filteredLatest = MOCK_BLOGS.filter((post) => {
    if (selectedCategory === 'all') return true;
    return post.categorySlug === selectedCategory;
  });

  const handleSearch = (query) => {
    if (query) {
      navigate(`/blogs?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Layout>
      <div className="home-page">
        {/* Hero Banner Section */}
        <section className="home-hero">
          <div className="container">
            <div className="hero-text-wrap">
              <Badge variant="blue" size="md">Enterprise Engineering Editorial</Badge>
              <h1 className="home-headline">
                Engineering Perspectives, Architecture & Tech Innovation
              </h1>
              <p className="home-lead">
                Curated technical articles on software development, cloud infrastructure, AI architecture, and cybersecurity. Written by practitioners for engineering leaders.
              </p>

              {/* Search Box */}
              <div className="home-search-container">
                <SearchBar
                  size="lg"
                  placeholder="Search articles, architecture patterns, topics..."
                  onSearch={handleSearch}
                />
              </div>

              {/* Quick Categories Bar */}
              <div className="quick-categories-row">
                <span className="quick-label">Browse Topics:</span>
                <div className="quick-pills">
                  {CATEGORIES.slice(0, 5).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/blogs?category=${cat.slug}`}
                      className="quick-pill-link"
                    >
                      <Badge variant="outline" size="sm">{cat.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles Section */}
        <section className="home-section featured-section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow">Top Stories</span>
                <h2 className="section-title">Featured Editorial</h2>
              </div>
              <Link to="/blogs" className="section-link">
                View all articles
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>

            <div className="featured-layout-grid">
              {/* Primary Large Featured Card */}
              <div className="primary-featured-col">
                <ArticleCard post={primaryFeatured} variant="hero" />
              </div>

              {/* Secondary Featured Side Cards */}
              <div className="secondary-featured-col">
                {secondaryFeatured.map((post) => (
                  <ArticleCard key={post.id} post={post} variant="default" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content: Latest Posts Grid + Trending Sidebar */}
        <section className="home-section latest-section">
          <div className="container">
            <div className="content-sidebar-layout">
              {/* Left Column: Latest Articles */}
              <div className="main-feed-col">
                <div className="feed-header">
                  <div>
                    <span className="section-eyebrow">Fresh Publications</span>
                    <h2 className="section-title">Latest Articles</h2>
                  </div>

                  {/* Category Pill Filters */}
                  <div className="category-filter-pills" role="tablist">
                    <button
                      type="button"
                      className={`filter-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('all')}
                      role="tab"
                      aria-selected={selectedCategory === 'all'}
                    >
                      All Domains
                    </button>
                    {CATEGORIES.slice(0, 4).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`filter-pill-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.slug)}
                        role="tab"
                        aria-selected={selectedCategory === cat.slug}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Articles Grid */}
                <div className="latest-articles-grid">
                  {filteredLatest.map((post) => (
                    <ArticleCard key={post.id} post={post} variant="default" />
                  ))}
                </div>

                <div className="feed-footer-action">
                  <Link to="/blogs">
                    <Button variant="outline" size="lg" icon={<Icon name="arrow-right" size={16} />} iconPosition="right">
                      Explore All Published Articles ({MOCK_BLOGS.length})
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Trending / Popular Articles & Newsletter */}
              <aside className="sidebar-col">
                {/* Trending Section */}
                <div className="sidebar-widget trending-widget">
                  <div className="widget-header">
                    <h3 className="widget-title">
                      Trending Articles
                    </h3>
                    <span className="widget-sub">Most read this week</span>
                  </div>
                  <div className="trending-list">
                    {trendingPosts.map((post, idx) => (
                      <div key={post.id} className="trending-item-row">
                        <span className="trending-rank">0{idx + 1}</span>
                        <ArticleCard post={post} variant="compact" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories Widget */}
                <div className="sidebar-widget categories-widget">
                  <h3 className="widget-title">Domains & Topics</h3>
                  <div className="sidebar-category-list">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/blogs?category=${cat.slug}`}
                        className="sidebar-category-row"
                      >
                        <span className="sidebar-cat-name">{cat.name}</span>
                        <span className="sidebar-cat-badge">{cat.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Box */}
                <div className="sidebar-widget newsletter-widget">
                  <Badge variant="green" size="sm">Weekly Briefing</Badge>
                  <h4>Subscribe to FlyerTech</h4>
                  <p>Get architectural breakdowns and technology analysis delivered to your inbox every Thursday.</p>
                  <Link to="/about">
                    <Button variant="primary" size="sm" className="w-100">
                      Learn About Us
                    </Button>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
