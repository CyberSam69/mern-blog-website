import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Button from './components/common/Button';
import Badge from './components/common/Badge';
import SearchBar from './components/common/SearchBar';
import Icon from './components/common/Icon';
import About from './pages/public/About';
import { CATEGORIES } from './utils/constants';

function HomePreview() {
  return (
    <Layout>
      <div className="home-preview-hero" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: 'var(--spacing-3xl) 0',
      }}>
        <div className="container" style={{ maxWidth: '860px', textAlign: 'center' }}>
          <Badge variant="blue" size="md">Enterprise Technology Journal</Badge>
          <h1 style={{
            fontSize: 'var(--font-size-4xl)',
            fontWeight: 800,
            margin: 'var(--spacing-md) 0 var(--spacing-sm)',
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>
            Architectural Insights for Modern Software Teams
          </h1>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-xl)',
            lineHeight: 1.6,
          }}>
            Explore production engineering practices, distributed systems, AI breakthroughs, and enterprise cloud architecture.
          </p>

          <div style={{ maxWidth: '580px', margin: '0 auto var(--spacing-lg)' }}>
            <SearchBar
              size="lg"
              onSearch={(q) => alert(`Search triggered for: "${q}"`)}
            />
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-light)', fontWeight: 600 }}>
              POPULAR DOMAINS:
            </span>
            {CATEGORIES.slice(0, 4).map((c) => (
              <Badge key={c.id} variant="outline" size="sm">
                {c.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Component Foundation Demonstration */}
      <div className="container" style={{ padding: 'var(--spacing-3xl) var(--spacing-md)' }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-2xl)',
          marginBottom: 'var(--spacing-2xl)',
        }}>
          <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-xl)' }}>
            Milestone 2 Frontend Foundation Active
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Header, responsive navigation, search bar, dropdowns, buttons, badges, corporate light theme, and footer are fully established.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/about">
              <Button variant="primary" icon={<Icon name="arrow-right" size={16} />} iconPosition="right">
                Explore About Page
              </Button>
            </Link>
            <Link to="/blogs">
              <Button variant="secondary">
                View All Articles (Preview)
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline" icon={<Icon name="lock" size={14} />}>
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <Layout>
      <div className="container" style={{ padding: 'var(--spacing-3xl) var(--spacing-md)', minHeight: '50vh' }}>
        <Badge variant="blue" size="md">FlyerTech Editorial</Badge>
        <h1 style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-base)' }}>{description}</p>
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <Link to="/">
            <Button variant="outline" icon={<Icon name="arrow-left" size={16} />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePreview />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/blogs"
          element={
            <PlaceholderPage
              title="All Published Articles"
              description="Listing and category filtering will be fully built in Milestone 3."
            />
          }
        />
        <Route
          path="/admin/login"
          element={
            <PlaceholderPage
              title="FlyerTech Admin Access"
              description="Administrative login and management portal will be connected in Milestone 6."
            />
          }
        />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page Not Found (404)"
              description="The requested page could not be located."
            />
          }
        />
      </Routes>
    </Router>
  );
}
