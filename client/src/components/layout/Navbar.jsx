import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import { CATEGORIES } from '../../utils/constants';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  // Close menus when route changes or clicking outside
  const closeAll = () => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeAll}>
          <img src="/flyertech-logo.svg" alt="FlyerTech Logo" className="logo-icon" />
          <div className="brand-text">
            <span className="brand-name">Flyer<span className="brand-highlight">Tech</span></span>
            <span className="brand-badge">BLOG</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            All Articles
          </NavLink>

          {/* Categories Dropdown */}
          <div
            className="nav-item-dropdown"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              type="button"
              className={`nav-link dropdown-toggle ${categoriesOpen ? 'open' : ''}`}
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              aria-expanded={categoriesOpen}
            >
              <span>Categories</span>
              <Icon name="chevron-down" size={14} />
            </button>

            {categoriesOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">Explore by Domain</div>
                <div className="dropdown-grid">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/blogs?category=${cat.slug}`}
                      className="dropdown-item"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      <span className="dropdown-item-name">{cat.name}</span>
                      <span className="dropdown-item-count">{cat.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            About
          </NavLink>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Search Toggle */}
          <div className="header-search-wrapper">
            {searchOpen ? (
              <form className="inline-search-form" onSubmit={handleSearchSubmit}>
                <input
                  type="search"
                  placeholder="Search articles..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  className="inline-search-input"
                  autoFocus
                />
                <button type="submit" className="inline-search-btn" aria-label="Submit search">
                  <Icon name="search" size={16} />
                </button>
                <button
                  type="button"
                  className="inline-search-close"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search input"
                >
                  <Icon name="x" size={16} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="search-toggle-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search bar"
                title="Search articles"
              >
                <Icon name="search" size={18} />
              </button>
            )}
          </div>

          {/* Admin CMS Access */}
          <Link to="/admin/login" className="admin-portal-link" title="Admin Portal">
            <Icon name="lock" size={14} />
            <span className="admin-label">Admin Portal</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Search FlyerTech..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-btn">
              <Icon name="search" size={18} />
            </button>
          </form>

          <nav className="mobile-nav-links">
            <NavLink to="/" className="mobile-link" onClick={closeAll}>
              Home
            </NavLink>
            <NavLink to="/blogs" className="mobile-link" onClick={closeAll}>
              All Articles
            </NavLink>
            <div className="mobile-categories-group">
              <span className="mobile-group-title">Categories</span>
              <div className="mobile-category-list">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/blogs?category=${cat.slug}`}
                    className="mobile-category-link"
                    onClick={closeAll}
                  >
                    <span>{cat.name}</span>
                    <span className="mobile-cat-count">{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>
            <NavLink to="/about" className="mobile-link" onClick={closeAll}>
              About FlyerTech
            </NavLink>
            <Link to="/admin/login" className="mobile-link admin-mobile-link" onClick={closeAll}>
              <Icon name="lock" size={16} />
              <span>Admin Management</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

