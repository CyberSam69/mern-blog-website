import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Icon from '../../components/common/Icon';
import api from '../../utils/api';
import { CATEGORIES as INITIAL_CATEGORIES } from '../../utils/constants';
import './AdminCategories.css';

const DEFAULT_TAGS = [
  'Architecture',
  'Microservices',
  'Distributed Systems',
  'Kafka',
  'Security',
  'Zero Trust',
  'Kubernetes',
  'AI',
  'LLM',
  'RAG',
  'Node.js',
  'Performance',
  'Backend',
  'Cloud',
  'DevOps',
  'Web Standards',
  'Developer Productivity',
];

export default function AdminCategories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = async () => {
    try {
      const [catRes, tagRes] = await Promise.all([
        api.get('/categories'),
        api.get('/tags'),
      ]);
      if (catRes.data?.success && catRes.data?.data) {
        setCategories(catRes.data.data);
      }
      if (tagRes.data?.success && tagRes.data?.data) {
        setTags(tagRes.data.data.map((t) => t.name));
      }
    } catch {
      // Offline fallback state already initialized
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!catName.trim()) {
      setErrorMessage('Please enter a category name');
      return;
    }

    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      if (editingCatId) {
        await api.put(`/categories/${editingCatId}`, { name: catName, description: catDesc });
        setMessage('Category updated successfully');
      } else {
        await api.post('/categories', { name: catName, description: catDesc });
        setMessage('Category created successfully');
      }
      loadData();
    } catch {
      // Local state update
      if (editingCatId) {
        setCategories((prev) =>
          prev.map((c) =>
            (c.id || c._id) === editingCatId
              ? { ...c, name: catName, slug, description: catDesc }
              : c
          )
        );
        setMessage('Category updated in local session');
      } else {
        const newCat = {
          id: `cat-${Date.now()}`,
          name: catName,
          slug,
          description: catDesc,
          count: 0,
        };
        setCategories((prev) => [...prev, newCat]);
        setMessage('Category created in local session');
      }
    }

    setCatName('');
    setCatDesc('');
    setEditingCatId(null);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleEditClick = (cat) => {
    setEditingCatId(cat.id || cat._id);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDeleteCategory = async (id, count) => {
    if (count > 0) {
      alert(`Cannot delete category: ${count} articles are currently assigned to this category.`);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.delete(`/categories/${id}`);
      setMessage('Category deleted successfully');
      loadData();
    } catch {
      setCategories((prev) => prev.filter((c) => (c.id || c._id) !== id));
      setMessage('Category deleted from local session');
    }
    setTimeout(() => setMessage(''), 4000);
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;

    const trimmed = newTagInput.trim();
    if (tags.includes(trimmed)) {
      alert('This tag already exists');
      return;
    }

    try {
      await api.post('/tags', { name: trimmed });
      setTags((prev) => [...prev, trimmed]);
    } catch {
      setTags((prev) => [...prev, trimmed]);
    }
    setNewTagInput('');
  };

  const handleDeleteTag = (tagName) => {
    if (window.confirm(`Remove tag "${tagName}"?`)) {
      setTags((prev) => prev.filter((t) => t !== tagName));
    }
  };

  return (
    <AdminLayout title="Categories & Tags Management">
      <div className="admin-categories-page">
        {/* Alerts */}
        {message && (
          <div className="cat-alert-success">
            <Icon name="check" size={16} color="#15803D" />
            <span>{message}</span>
          </div>
        )}
        {errorMessage && (
          <div className="cat-alert-error">
            <Icon name="x" size={16} color="var(--color-danger)" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="categories-grid-layout">
          {/* Form Column */}
          <div className="category-form-card">
            <h3 className="card-title">
              {editingCatId ? 'Edit Domain Category' : 'Create New Category'}
            </h3>
            <p className="card-desc">
              Organize technological insights into coherent topical domains.
            </p>

            <form onSubmit={handleSaveCategory} className="cat-form">
              <div className="form-group">
                <label htmlFor="cat-name-input" className="form-label">
                  Category Name *
                </label>
                <input
                  id="cat-name-input"
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Distributed Databases"
                  required
                  className="cat-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cat-desc-input" className="form-label">
                  Description
                </label>
                <textarea
                  id="cat-desc-input"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Describe the technical scope covered under this domain..."
                  rows={3}
                  className="cat-textarea"
                />
              </div>

              <div className="form-actions-row">
                {editingCatId && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingCatId(null);
                      setCatName('');
                      setCatDesc('');
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button variant="primary" type="submit" icon={<Icon name="check" size={16} />}>
                  {editingCatId ? 'Update Category' : 'Save Category'}
                </Button>
              </div>
            </form>
          </div>

          {/* List Column */}
          <div className="category-list-card">
            <div className="list-card-header">
              <h3 className="card-title">Active Domain Categories ({categories.length})</h3>
              <span className="card-sub">Initial 7 core technical categories</span>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Domain Name</th>
                    <th>Slug</th>
                    <th>Articles</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => {
                    const catId = cat.id || cat._id;
                    const count = cat.count || 0;
                    return (
                      <tr key={catId}>
                        <td>
                          <strong>{cat.name}</strong>
                          {cat.description && (
                            <p className="cat-inline-desc">{cat.description}</p>
                          )}
                        </td>
                        <td>
                          <code className="cat-slug-code">{cat.slug}</code>
                        </td>
                        <td>
                          <Badge variant="blue" size="sm">{count} posts</Badge>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="action-btn-sm edit"
                              onClick={() => handleEditClick(cat)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn-sm delete"
                              onClick={() => handleDeleteCategory(catId, count)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="tags-management-card">
          <div className="tags-card-header">
            <div>
              <h3 className="card-title">Editorial Tags ({tags.length})</h3>
              <p className="card-desc">Keywords for indexing cross-cutting concepts across technology articles.</p>
            </div>

            <form onSubmit={handleAddTag} className="tag-add-form">
              <input
                type="text"
                placeholder="New tag name..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className="tag-add-input"
              />
              <button type="submit" className="tag-add-btn">
                Add Tag
              </button>
            </form>
          </div>

          <div className="tags-cloud-wrap">
            {tags.map((tag, idx) => (
              <span key={idx} className="tag-pill-item">
                <span className="tag-pill-text">#{tag}</span>
                <button
                  type="button"
                  className="tag-remove-x"
                  onClick={() => handleDeleteTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

