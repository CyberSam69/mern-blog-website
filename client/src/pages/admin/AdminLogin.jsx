import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/common/Icon';
import Badge from '../../components/common/Badge';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@softrateSAM.com');
  const [password, setPassword] = useState('admin@007');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-header">
          <Link to="/" className="login-brand-link">
            <img src="/flyertech-logo.svg" alt="FlyerTech" className="login-logo" />
            <div className="login-brand-text">
              <span className="brand-name">Flyer<span className="brand-highlight">Tech</span></span>
              <span className="login-badge">CMS PORTAL</span>
            </div>
          </Link>
          <h2 className="login-title">Editorial Management Sign In</h2>
          <p className="login-subtitle">
            Enter administrative credentials to manage publication workflows, articles, authors, and categories.
          </p>
        </div>

        {/* Credentials Info Callout */}
        <div className="credentials-hint-box">
          <Badge variant="blue" size="sm">Default Admin Access</Badge>
          <div className="hint-rows">
            <div className="hint-row">
              <span className="hint-key">User ID:</span>
              <code className="hint-val">admin@softrateSAM.com</code>
            </div>
            <div className="hint-row">
              <span className="hint-key">Password:</span>
              <code className="hint-val">admin@007</code>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert" role="alert">
            <Icon name="x" size={16} color="var(--color-danger)" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email" className="form-label">
              Admin User ID / Corporate Email
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <Icon name="user" size={16} color="var(--text-secondary)" />
              </span>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@softrateSAM.com"
                required
                className="form-input"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">
              Admin Password
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <Icon name="lock" size={16} color="var(--text-secondary)" />
              </span>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/" className="back-to-site-link">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

