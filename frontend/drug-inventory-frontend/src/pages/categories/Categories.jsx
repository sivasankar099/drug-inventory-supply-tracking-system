import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { categoryAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Categories.css';

const ICONS = ['💊', '🧪', '🩺', '💉', '🌡️', '🧬', '❤️', '🦷', '👁️', '🧠'];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '💊' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch {
      toast.error('Failed to fetch categories!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await categoryAPI.update(editCategory.id, form);
        toast.success('Category updated! ✅');
      } else {
        await categoryAPI.create(form);
        toast.success('Category added! ✅');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch {
      toast.error('Operation failed!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      toast.success('Category deleted! 🗑️');
      fetchData();
    } catch {
      toast.error('Delete failed!');
    }
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);
    setForm({ name: cat.name || '', description: cat.description || '', icon: cat.icon || '💊' });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ name: '', description: '', icon: '💊' });
    setEditCategory(null);
  };

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>💊 Category Management</h1>
            <p>Manage drug categories in the system</p>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            ➕ Add Category
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading categories... ⏳</div>
        ) : (
          <div className="categories-grid">
            {categories.length === 0 ? (
              <div className="no-data">No categories found! Add your first category. 💊</div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="category-card">
                  <span className="category-icon">{cat.icon || '💊'}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.description || 'No description'}</p>
                  <div className="category-actions">
                    <button className="btn-edit" onClick={() => handleEdit(cat)}>✏️ Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(cat.id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editCategory ? '✏️ Edit Category' : '➕ Add Category'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Antibiotics"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setForm({ ...form, icon })}
                        style={{
                          fontSize: '1.5rem', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                          background: form.icon === icon ? '#f59e0b20' : '#1a1a1a',
                          border: form.icon === icon ? '2px solid #f59e0b' : '1px solid #2a2a2a',
                          transition: 'all 0.2s'
                        }}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Brief description..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows="3"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editCategory ? '✅ Update' : '➕ Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;