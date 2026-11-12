import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { fetchArticles, fetchCategories, deletePost } from '../../utils/blogService';
import './AdminPosts.css';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadPosts = async () => {
    setLoading(true);
    const [postsRes, catsRes] = await Promise.all([
      fetchArticles({ limit: 100 }),
      fetchCategories(),
    ]);
    setPosts(postsRes.articles || []);
    setCategories(catsRes || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setActionMessage('Article deleted successfully.');
      setDeleteConfirmId(null);
      setPosts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      setTimeout(() => setActionMessage(''), 4000);
    } catch {
      // Offline fallback deletion from state
      setPosts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      setDeleteConfirmId(null);
      setActionMessage('Article removed from local session.');
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      // Status filter
      if (selectedStatus !== 'all' && p.status !== selectedStatus) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all') {
        const catSlug = typeof p.category === 'object' && p.category !== null ? p.category.slug : (p.categorySlug || '');
        if (catSlug !== selectedCategory) {
          return false;
        }
      }
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inAuthor = p.author?.name?.toLowerCase().includes(q);
        if (!inTitle && !inAuthor) return false;
      }
      return true;
    });
  }, [posts, selectedStatus, selectedCategory, searchQuery]);

  return (
    <AdminLayout title="Manage Articles">
      <div className="admin-posts-page">
        {/* Top Actions & Notification */}
        <div className="posts-header-row">
          <div>
            <h2 className="section-title">All Published & Draft Articles</h2>
            <p className="section-desc">Create, edit, schedule, and curate technology blog articles.</p>
          </div>
          <Link to="/admin/posts/new">
            <Button variant="primary" icon={<Icon name="check" size={16} />}>
              + Create New Article
            </Button>
          </Link>
        </div>

        {actionMessage && (
          <div className="action-success-banner">
            <Icon name="check" size={16} color="#15803D" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Filters Bar */}
        <div className="posts-filter-card">
          <div className="status-tabs-row" role="tablist">
            <button
              type="button"
              className={`status-tab ${selectedStatus === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('all')}
              role="tab"
              aria-selected={selectedStatus === 'all'}
            >
              All Articles ({posts.length})
            </button>
            <button
              type="button"
              className={`status-tab ${selectedStatus === 'published' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('published')}
              role="tab"
              aria-selected={selectedStatus === 'published'}
            >
              Published ({posts.filter((p) => p.status === 'published').length})
            </button>
            <button
              type="button"
              className={`status-tab ${selectedStatus === 'draft' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('draft')}
              role="tab"
              aria-selected={selectedStatus === 'draft'}
            >
              Drafts ({posts.filter((p) => p.status === 'draft').length})
            </button>
            <button
              type="button"
              className={`status-tab ${selectedStatus === 'scheduled' ? 'active' : ''}`}
              onClick={() => setSelectedStatus('scheduled')}
              role="tab"
              aria-selected={selectedStatus === 'scheduled'}
            >
              Scheduled ({posts.filter((p) => p.status === 'scheduled').length})
            </button>
          </div>

          <div className="posts-search-filter-row">
            <div className="search-input-box">
              <Icon name="search" size={16} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder="Search articles by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-text-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-category-select"
            >
              <option value="all">All Domain Categories</option>
              {categories.map((c) => (
                <option key={c.id || c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Table */}
        <div className="posts-table-card">
          <div className="admin-table-container">
            <table className="admin-table posts-data-table">
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Published / Scheduled</th>
                  <th>Read Time</th>
                  <th>Views</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px' }}>
                      Loading article repository...
                    </td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px' }}>
                      No articles match your active filter.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => {
                    const postId = post.id || post._id;
                    const dateStr = post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Draft';

                    return (
                      <tr key={postId}>
                        <td className="cell-post-title">
                          <Link to={`/admin/posts/edit/${postId}`} className="post-name-link">
                            {post.title}
                          </Link>
                          <div className="post-badges-row">
                            {post.isFeatured && (
                              <span className="tiny-badge featured">Featured</span>
                            )}
                            {post.isTrending && (
                              <span className="tiny-badge trending">Trending</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <Badge variant="blue" size="sm">
                            {typeof post.category === 'object' && post.category !== null
                              ? post.category.name
                              : (post.category || 'Technology')}
                          </Badge>
                        </td>
                        <td>
                          <span className="author-cell-text">{post.author?.name}</span>
                        </td>
                        <td>
                          <Badge
                            variant={
                              post.status === 'published'
                                ? 'green'
                                : post.status === 'scheduled'
                                ? 'blue'
                                : 'gray'
                            }
                            size="sm"
                          >
                            {post.status}
                          </Badge>
                        </td>
                        <td className="cell-date">{dateStr}</td>
                        <td className="cell-readtime">{post.readTime}</td>
                        <td className="cell-views">{post.views || 0}</td>
                        <td>
                          <div className="actions-cell">
                            <Link
                              to={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-btn view-btn"
                              title="View live post"
                            >
                              View
                            </Link>
                            <Link
                              to={`/admin/posts/edit/${postId}`}
                              className="action-btn edit-btn"
                              title="Edit post"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              className="action-btn delete-btn"
                              onClick={() => setDeleteConfirmId(postId)}
                              title="Delete post"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card">
              <h3>Confirm Article Deletion</h3>
              <p>
                Are you sure you want to permanently delete this article? This action cannot be undone.
              </p>
              <div className="modal-actions-row">
                <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>
                  Cancel
                </Button>
                <button
                  type="button"
                  className="btn-danger-confirm"
                  onClick={() => handleDelete(deleteConfirmId)}
                >
                  Yes, Delete Article
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

