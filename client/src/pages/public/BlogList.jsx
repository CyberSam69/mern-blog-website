import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ArticleCard from '../../components/blog/ArticleCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Icon from '../../components/common/Icon';
import { CATEGORIES } from '../../utils/constants';
import { MOCK_BLOGS } from '../../utils/mockBlogs';
import './BlogList.css';

const POSTS_PER_PAGE = 6;

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular'

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory, currentSearch]);

  const handleCategorySelect = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    setSearchParams(params);
  };

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    return MOCK_BLOGS.filter((post) => {
      // Category match
      if (currentCategory !== 'all' && post.categorySlug !== currentCategory) {
        return false;
      }
      // Search keyword match
      if (currentSearch) {
        const query = currentSearch.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(query);
        const inExcerpt = post.excerpt.toLowerCase().includes(query);
        const inCategory = post.category.toLowerCase().includes(query);
        const inTags = post.tags?.some((t) => t.toLowerCase().includes(query));
        if (!inTitle && !inExcerpt && !inCategory && !inTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });
  }, [currentCategory, currentSearch, sortBy]);

  // Paginated articles
  const totalPages = Math.ceil(filteredArticles.length / POSTS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredArticles.slice(start, start + POSTS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === currentCategory);

  return (
    <Layout>
      <div className="blog-list-page">
        {/* Header Hero */}
        <section className="blog-list-header">
          <div className="container">
            <div className="list-header-content">
              <Badge variant="blue" size="md">FlyerTech Archive</Badge>
              <h1 className="list-title">
                {activeCategoryObj ? activeCategoryObj.name : 'All Technology Articles'}
              </h1>
              <p className="list-subtitle">
                {activeCategoryObj
                  ? `In-depth articles, design patterns, and engineering guides for ${activeCategoryObj.name}.`
                  : 'Explore our full library of software architecture, cloud native, cybersecurity, and AI engineering articles.'}
              </p>

              {/* Search Bar */}
              <div className="list-search-wrapper">
                <SearchBar
                  size="md"
                  placeholder="Search articles by keyword, topic, or technology..."
                  initialValue={currentSearch}
                  onSearch={handleSearch}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Control Bar */}
        <section className="filter-bar-section">
          <div className="container">
            <div className="filter-bar">
              {/* Category Pills */}
              <div className="category-scroll-wrap" role="tablist">
                <button
                  type="button"
                  className={`cat-pill ${currentCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategorySelect('all')}
                  role="tab"
                  aria-selected={currentCategory === 'all'}
                >
                  All ({MOCK_BLOGS.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`cat-pill ${currentCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.slug)}
                    role="tab"
                    aria-selected={currentCategory === cat.slug}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="sort-control">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="latest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(currentCategory !== 'all' || currentSearch) && (
              <div className="active-filters-row">
                <span className="filters-label">Active Filters:</span>
                {currentCategory !== 'all' && (
                  <Badge variant="blue" size="sm">
                    Category: {activeCategoryObj?.name || currentCategory}
                    <button
                      type="button"
                      className="filter-remove-x"
                      onClick={() => handleCategorySelect('all')}
                      aria-label="Remove category filter"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {currentSearch && (
                  <Badge variant="green" size="sm">
                    Search: "{currentSearch}"
                    <button
                      type="button"
                      className="filter-remove-x"
                      onClick={() => handleSearch('')}
                      aria-label="Remove search filter"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <button
                  type="button"
                  className="clear-all-link"
                  onClick={clearAllFilters}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Articles Results Section */}
        <section className="articles-results-section">
          <div className="container">
            {/* Results count */}
            <div className="results-meta">
              <span className="results-count">
                Showing <strong>{paginatedArticles.length}</strong> of <strong>{filteredArticles.length}</strong> articles
              </span>
            </div>

            {/* Empty State */}
            {filteredArticles.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-icon-wrap">
                  <Icon name="search" size={32} color="var(--text-light)" />
                </div>
                <h3>No articles found</h3>
                <p>We couldn't find any articles matching your search criteria. Try using different keywords or clearing your filters.</p>
                <Button variant="primary" onClick={clearAllFilters}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              /* Articles Grid */
              <div className="articles-grid-3col">
                {paginatedArticles.map((post) => (
                  <ArticleCard key={post.id} post={post} variant="default" />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

