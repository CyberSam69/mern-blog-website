import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import api from '../../utils/api';
import './AdminAuthors.css';

const DEFAULT_AUTHORS_LIST = [
  {
    id: 'auth-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@flyertech.com',
    role: 'Principal Systems Architect',
    bio: 'Over 15 years architecting high-throughput distributed systems and event-driven data pipelines.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    articlesCount: 2,
  },
  {
    id: 'auth-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@flyertech.com',
    role: 'Chief Information Security Officer',
    bio: 'Cybersecurity researcher specializing in Zero Trust cloud workloads, cryptographic attestation, and threat modeling.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    articlesCount: 1,
  },
  {
    id: 'auth-3',
    name: 'Dr. Aris Thorne',
    email: 'aris.thorne@flyertech.com',
    role: 'Head of AI Research',
    bio: 'Directing enterprise neural systems research with an emphasis on RAG vector pipelines and fine-tuned domain models.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    articlesCount: 1,
  },
  {
    id: 'auth-4',
    name: 'Devon Patel',
    email: 'devon.patel@flyertech.com',
    role: 'Staff Backend Engineer',
    bio: 'Specializing in Node.js event-loop performance tuning, high-concurrency REST APIs, and database indexing.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    articlesCount: 1,
  },
  {
    id: 'auth-5',
    name: 'Sarah Lindqvist',
    email: 'sarah.lindqvist@flyertech.com',
    role: 'VP of Platform Engineering',
    bio: 'Leading global cloud platform infrastructure, multi-cluster Kubernetes fleets, and developer productivity tooling.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    articlesCount: 2,
  },
];

export default function AdminAuthors() {
  const [authors, setAuthors] = useState(DEFAULT_AUTHORS_LIST);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadAuthors = async () => {
    try {
      const res = await api.get('/authors');
      if (res.data?.success && res.data?.data) {
        setAuthors(res.data.data);
      }
    } catch {
      // Fallback state already initialized
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleSaveAuthor = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      email,
      role: role || 'Technical Contributor',
      bio,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    try {
      if (editingId) {
        await api.put(`/authors/${editingId}`, payload);
        setMessage('Author updated successfully');
      } else {
        await api.post('/authors', payload);
        setMessage('Author added successfully');
      }
      loadAuthors();
    } catch {
      if (editingId) {
        setAuthors((prev) =>
          prev.map((a) => ((a.id || a._id) === editingId ? { ...a, ...payload } : a))
        );
        setMessage('Author updated in local session');
      } else {
        setAuthors((prev) => [...prev, { id: `auth-${Date.now()}`, ...payload, articlesCount: 0 }]);
        setMessage('Author added to local session');
      }
    }

    setName('');
    setEmail('');
    setRole('');
    setBio('');
    setAvatar('');
    setEditingId(null);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleEditClick = (auth) => {
    setEditingId(auth.id || auth._id);
    setName(auth.name);
    setEmail(auth.email || '');
    setRole(auth.role || '');
    setBio(auth.bio || '');
    setAvatar(auth.avatar || '');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleDeleteAuthor = (id, count) => {
    if (count > 0) {
      alert(`Cannot delete author: ${count} published articles are attributed to this contributor.`);
      return;
    }
    if (window.confirm('Are you sure you want to remove this author?')) {
      setAuthors((prev) => prev.filter((a) => (a.id || a._id) !== id));
      setMessage('Author removed');
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <AdminLayout title="Manage Authors & Contributors">
      <div className="admin-authors-page">
        {message && (
          <div className="authors-alert-success">
            <Icon name="check" size={16} color="#15803D" />
            <span>{message}</span>
          </div>
        )}

        <div className="authors-split-layout">
          {/* Add / Edit Author Card */}
          <div className="author-form-card">
            <h3 className="card-title">
              {editingId ? 'Edit Author Profile' : 'Add New Technical Contributor'}
            </h3>
            <p className="card-desc">
              Define practitioner profiles with corporate roles and biographies.
            </p>

            <form onSubmit={handleSaveAuthor} className="author-form">
              <div className="form-group">
                <label htmlFor="author-name-input" className="form-label">
                  Author Full Name *
                </label>
                <input
                  id="author-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  required
                  className="author-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author-email-input" className="form-label">
                  Corporate Email
                </label>
                <input
                  id="author-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@flyertech.com"
                  className="author-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author-role-input" className="form-label">
                  Professional Role / Job Title
                </label>
                <input
                  id="author-role-input"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Principal Systems Architect"
                  className="author-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author-avatar-input" className="form-label">
                  Avatar Image URL
                </label>
                <input
                  id="author-avatar-input"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="author-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="author-bio-input" className="form-label">
                  Bio / Background
                </label>
                <textarea
                  id="author-bio-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief practitioner profile, experience, and domain expertise..."
                  rows={3}
                  className="author-textarea"
                />
              </div>

              <div className="form-actions-row">
                {editingId && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setName('');
                      setEmail('');
                      setRole('');
                      setBio('');
                      setAvatar('');
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button variant="primary" type="submit" icon={<Icon name="check" size={16} />}>
                  {editingId ? 'Update Author' : 'Save Author'}
                </Button>
              </div>
            </form>
          </div>

          {/* Authors List Grid */}
          <div className="authors-list-col">
            <div className="authors-list-header">
              <h3 className="card-title">Active Contributors ({authors.length})</h3>
              <span className="card-sub">Technical editorial contributors</span>
            </div>

            <div className="authors-cards-grid">
              {authors.map((auth) => {
                const authId = auth.id || auth._id;
                return (
                  <div key={authId} className="author-item-card">
                    <img
                      src={auth.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={auth.name}
                      className="author-card-avatar"
                    />
                    <div className="author-card-body">
                      <div className="author-name-role-row">
                        <h4 className="author-card-name">{auth.name}</h4>
                        <span className="author-articles-pill">
                          {auth.articlesCount || 1} articles
                        </span>
                      </div>
                      <span className="author-card-role">{auth.role}</span>
                      {auth.email && (
                        <span className="author-card-email">{auth.email}</span>
                      )}
                      <p className="author-card-bio">{auth.bio}</p>

                      <div className="author-card-actions">
                        <button
                          type="button"
                          className="action-btn-sm edit"
                          onClick={() => handleEditClick(auth)}
                        >
                          Edit Profile
                        </button>
                        <button
                          type="button"
                          className="action-btn-sm delete"
                          onClick={() => handleDeleteAuthor(authId, auth.articlesCount || 0)}
                        >
                          Remove
                        </button>
                      </div>
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
