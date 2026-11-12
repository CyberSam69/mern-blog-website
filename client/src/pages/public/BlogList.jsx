import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ArticleCard from '../../components/blog/ArticleCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Icon from '../../components/common/Icon';
import { fetchArticles, fetchCategories } from '../../utils/blogService';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../utils/constants';
import './BlogList.css';

const POSTS_PER_PAGE = 6;

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'popular'

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      const cats = await fetchCategories();
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    }
    loadCategories();
  }, []);

  // Fetch articles whenever filter / sort / page changes
  useEffect(() => {
    let isMounted = true;
    async function loadArticles() {
      setLoading(true);
      const res = await fetchArticles({
        category: currentCategory,
        search: currentSearch,
        sort: sortBy,
        page: currentPage,
        limit: POSTS_PER_PAGE,
      });
      if (isMounted) {
        setArticles(res.articles || []);
        setTotal(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setLoading(false);
      }
    }
    loadArticles();
    return () => {
      isMounted = false;
    };
  }, [currentCategory, currentSearch, sortBy, currentPage]);

  const handleCategorySelect = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    params.delete('page');
    setCurrentPage(1);
    setSearchParams(params);
  };

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.delete('page');
    setCurrentPage(1);
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setCurrentPage(1);
    setSearchParams({});
  };

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

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
                  All ({total || categories.reduce((sum, c) => sum + (c.count || 0), 0) || 7})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id || cat._id}
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
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
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
                Showing <strong>{articles.length}</strong> of <strong>{total}</strong> articles
              </span>
            </div>

            {/* Loading / Empty / Content states */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl) 0', color: 'var(--text-secondary)' }}>
                Loading articles from archive...
              </div>
            ) : articles.length === 0 ? (
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
                {articles.map((post) => (
                  <ArticleCard key={post.id || post._id} post={post} variant="default" />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
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
