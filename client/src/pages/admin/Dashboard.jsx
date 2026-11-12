import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { fetchArticles, fetchCategories } from '../../utils/blogService';
import './Dashboard.css';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      const [postRes, catRes] = await Promise.all([
        fetchArticles({ limit: 50 }),
        fetchCategories(),
      ]);
      setPosts(postRes.articles || []);
      setCategories(catRes || []);
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  const totalPosts = posts.length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  const recentPosts = posts.slice(0, 5);

  return (
    <AdminLayout title="Editorial Dashboard">
      <div className="admin-dashboard">
        {/* Welcome Banner */}
        <div className="dashboard-welcome-banner">
          <div>
            <h2 className="welcome-title">Welcome to FlyerTech Editorial CMS</h2>
            <p className="welcome-sub">
              Monitor publication performance, manage draft revisions, and schedule technology insights.
            </p>
          </div>
          <div className="welcome-actions">
            <Link to="/admin/posts/new">
              <Button variant="primary" icon={<Icon name="check" size={16} />}>
                Create Article
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-metric-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Articles</span>
              <span className="stat-icon-wrap blue">
                <Icon name="tag" size={18} color="var(--color-primary)" />
              </span>
            </div>
            <div className="stat-number">{loading ? '...' : totalPosts}</div>
            <span className="stat-sub">Across {categories.length} core domains</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Published</span>
              <span className="stat-icon-wrap green">
                <Icon name="check" size={18} color="#15803D" />
              </span>
            </div>
            <div className="stat-number">{loading ? '...' : publishedCount}</div>
            <span className="stat-sub">Live on public website</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Draft Revisions</span>
              <span className="stat-icon-wrap gray">
                <Icon name="calendar" size={18} color="var(--text-secondary)" />
              </span>
            </div>
            <div className="stat-number">{loading ? '...' : draftCount}</div>
            <span className="stat-sub">Unpublished work in progress</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Scheduled</span>
              <span className="stat-icon-wrap blue">
                <Icon name="clock" size={18} color="var(--color-primary)" />
              </span>
            </div>
            <div className="stat-number">{loading ? '...' : scheduledCount}</div>
            <span className="stat-sub">Queued for automated release</span>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Views</span>
              <span className="stat-icon-wrap green">
                <Icon name="user" size={18} color="#15803D" />
              </span>
            </div>
            <div className="stat-number">{loading ? '...' : totalViews.toLocaleString()}</div>
            <span className="stat-sub">Cumulative article readership</span>
          </div>
        </div>

        {/* Split Grid: Recent Articles Table + Categories Breakdown */}
        <div className="dashboard-split-grid">
          {/* Recent Articles */}
          <div className="dashboard-card recent-posts-card">
            <div className="card-header-bar">
              <div>
                <h3 className="card-heading">Recent Editorial Activity</h3>
                <span className="card-subheading">Latest articles in the repository</span>
              </div>
              <Link to="/admin/posts" className="card-view-all">
                View all ({totalPosts}) →
              </Link>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Article Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                        Loading recent articles...
                      </td>
                    </tr>
                  ) : recentPosts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                        No articles found. Create your first post!
                      </td>
                    </tr>
                  ) : (
                    recentPosts.map((p) => (
                      <tr key={p.id || p._id}>
                        <td className="cell-title">
                          <Link to={`/admin/posts/edit/${p.id || p._id}`} className="table-title-link">
                            {p.title}
                          </Link>
                        </td>
                        <td>
                          <Badge variant="blue" size="sm">{p.category}</Badge>
                        </td>
                        <td className="cell-author">{p.author?.name}</td>
                        <td>
                          <Badge
                            variant={p.status === 'published' ? 'green' : p.status === 'scheduled' ? 'blue' : 'gray'}
                            size="sm"
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="cell-views">{p.views || 0}</td>
                        <td>
                          <Link to={`/admin/posts/edit/${p.id || p._id}`} className="table-action-link">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Categories Overview */}
          <div className="dashboard-card categories-stat-card">
            <div className="card-header-bar">
              <div>
                <h3 className="card-heading">Domain Categories</h3>
                <span className="card-subheading">Active coverage topics</span>
              </div>
              <Link to="/admin/categories" className="card-view-all">
                Manage →
              </Link>
            </div>

            <div className="category-bars-list">
              {categories.map((cat) => {
                const count = cat.count || 0;
                const pct = totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0;
                return (
                  <div key={cat.id || cat._id} className="category-stat-row">
                    <div className="cat-row-label">
                      <span className="cat-stat-name">{cat.name}</span>
                      <span className="cat-stat-count">{count} articles ({pct}%)</span>
                    </div>
                    <div className="cat-progress-bg">
                      <div className="cat-progress-fill" style={{ width: `${Math.max(5, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
