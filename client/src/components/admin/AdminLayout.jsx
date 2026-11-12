import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../common/Icon';
import './AdminLayout.css';

export default function AdminLayout({ children, title = 'Administration' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Sidebar Brand */}
        <div className="admin-brand">
          <Link to="/" className="admin-brand-link">
            <img src="/flyertech-logo.svg" alt="FlyerTech" className="admin-brand-icon" />
            <div className="admin-brand-text">
              <span className="brand-name">Flyer<span className="brand-highlight">Tech</span></span>
              <span className="admin-cms-badge">CMS</span>
            </div>
          </Link>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="admin-nav" aria-label="CMS Navigation">
          <div className="nav-group-title">Editorial Management</div>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
            end
          >
            <Icon name="calendar" size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/posts"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
            end
          >
            <Icon name="tag" size={18} />
            <span>Manage Posts</span>
          </NavLink>

          <NavLink
            to="/admin/posts/new"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name="check" size={18} />
            <span>Create New Post</span>
          </NavLink>

          <div className="nav-group-title">Taxonomy & Editorial</div>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name="tag" size={18} />
            <span>Categories & Tags</span>
          </NavLink>

          <NavLink
            to="/admin/authors"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name="user" size={18} />
            <span>Manage Authors</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-footer-btn" target="_blank" rel="noopener noreferrer">
            <Icon name="arrow-right" size={16} />
            <span>View Live Website</span>
          </Link>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <Icon name="x" size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="topbar-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Navigation Sidebar"
            >
              <Icon name="menu" size={20} />
            </button>
            <h1 className="admin-page-title">{title}</h1>
          </div>

          <div className="topbar-right">
            <Link to="/admin/posts/new" className="topbar-create-btn">
              <span>+ New Article</span>
            </Link>

            <div className="admin-user-pill">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Administrator'}
                className="admin-user-avatar"
              />
              <div className="admin-user-meta">
                <span className="admin-user-name">{user?.name || 'Administrator'}</span>
                <span className="admin-user-email">{user?.email || 'admin@softrateSAM.com'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="admin-body">
          {children}
        </main>
      </div>
    </div>
  );
}

