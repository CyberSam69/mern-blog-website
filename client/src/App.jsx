import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Button from './components/common/Button';
import Badge from './components/common/Badge';
import Icon from './components/common/Icon';
import Home from './pages/public/Home';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import About from './pages/public/About';

function NotFound() {
  return (
    <Layout>
      <div className="container" style={{ padding: 'var(--spacing-3xl) var(--spacing-md)', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Badge variant="blue" size="md">Error 404</Badge>
        <h1 style={{ margin: 'var(--spacing-md) 0 var(--spacing-xs)', fontSize: '2.5rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: 'var(--spacing-xl)', lineHeight: 1.6 }}>
          The page or article you are seeking does not exist or may have been relocated.
        </p>
        <Link to="/">
          <Button variant="primary" icon={<Icon name="arrow-left" size={16} />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </Layout>
  );
}

function AdminPlaceholder() {
  return (
    <Layout>
      <div className="container" style={{ padding: 'var(--spacing-3xl) var(--spacing-md)', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Badge variant="green" size="md">Administrative Portal</Badge>
        <h1 style={{ margin: 'var(--spacing-md) 0 var(--spacing-xs)', fontSize: '2.5rem' }}>FlyerTech CMS Login</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', marginBottom: 'var(--spacing-xl)', lineHeight: 1.6 }}>
          Administrative authentication, post management, categories, and author controls are scheduled for implementation in Milestone 6.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/">
            <Button variant="outline" icon={<Icon name="arrow-left" size={16} />}>
              Return to Website
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
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/login" element={<AdminPlaceholder />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
