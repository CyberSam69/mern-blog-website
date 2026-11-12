import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../common/Icon';
import { CATEGORIES, COMPANY_INFO } from '../../utils/constants';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Top Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <img src="/flyertech-logo.svg" alt="FlyerTech Logo" className="footer-logo-icon" />
              <div className="brand-text">
                <span className="brand-name">Flyer<span className="brand-highlight">Tech</span></span>
                <span className="brand-badge">BLOG</span>
              </div>
            </Link>
            <p className="footer-desc">
              {COMPANY_INFO.description}
            </p>
            <div className="footer-meta">
              <span className="meta-item">
                <Icon name="tag" size={14} color="var(--text-light)" />
                <span>Enterprise Technology & Architecture</span>
              </span>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/blogs?category=${cat.slug}`} className="footer-link">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/blogs" className="footer-link-more">
                  View all categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/blogs" className="footer-link">Latest Articles</Link></li>
              <li><Link to="/about" className="footer-link">About FlyerTech</Link></li>
              <li><Link to="/admin/login" className="footer-link admin-footer-link">
                <Icon name="lock" size={13} />
                <span>Admin Login</span>
              </Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-heading">Stay Informed</h4>
            <p className="newsletter-text">
              Subscribe to the FlyerTech editorial briefing. Deep technical articles delivered to your inbox weekly.
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                <Icon name="check" size={16} color="var(--color-success)" />
                <span>Thank you! You are now subscribed to the briefing.</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter your corporate email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </form>
            )}
            <span className="newsletter-note">Zero spam. Unsubscribe anytime.</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} FlyerTech. All rights reserved. Professional technology journalism & software architecture insights.
          </p>
          <div className="footer-bottom-links">
            <Link to="/about" className="bottom-link">Privacy Policy</Link>
            <span className="dot">•</span>
            <Link to="/about" className="bottom-link">Terms of Service</Link>
            <span className="dot">•</span>
            <Link to="/about" className="bottom-link">Editorial Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

