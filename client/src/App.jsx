import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/admin/AdminRoute';

// Public Pages
import Layout from './components/layout/Layout';
import Button from './components/common/Button';
import Badge from './components/common/Badge';
import Icon from './components/common/Icon';
import Home from './pages/public/Home';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import About from './pages/public/About';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/AdminPosts';
import PostEditor from './pages/admin/PostEditor';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAuthors from './pages/admin/AdminAuthors';

function NotFound() {
  return (
    <Layout>
      <div
        className="container"
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-md)',
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Badge variant="blue" size="md">Error 404</Badge>
        <h1 style={{ margin: 'var(--spacing-md) 0 var(--spacing-xs)', fontSize: '2.5rem' }}>
          Page Not Found
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            marginBottom: 'var(--spacing-xl)',
            lineHeight: 1.6,
          }}
        >
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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/categories" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/posts"
            element={
              <AdminRoute>
                <AdminPosts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/posts/new"
            element={
              <AdminRoute>
                <PostEditor />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/posts/edit/:id"
            element={
              <AdminRoute>
                <PostEditor />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/authors"
            element={
              <AdminRoute>
                <AdminAuthors />
              </AdminRoute>
            }
          />

          {/* 404 Wildcard */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
