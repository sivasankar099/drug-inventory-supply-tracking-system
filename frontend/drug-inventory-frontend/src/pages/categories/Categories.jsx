import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { categoryAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch (error) {
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
    } catch (error) {
      toast.error('Operation failed!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryAPI.delete(id);
      toast.success('Category deleted! 🗑️');
      fetchData();
    } catch (error) {
      toast.error('Delete failed!');
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setForm({ name: category.name || '', description: category.description || '' });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditCategory(null);
  };

  const icons = ['💊', '💉', '🩺', '🧪', '🩹', '❤️', '🧬', '🏥'];

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>🗂️ Category Management</h1>
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
              <p className="no-data">No categories found!</p>
            ) : (
              categories.map((cat, index) => (
                <div key={cat.id} className="category-card">
                  <div className="category-icon">{icons[index % icons.length]}</div>
                  <div className="category-info">
                    <h3>{cat.name}</h3>
                    <p>{cat.description || 'No description'}</p>
                  </div>
                  <div className="category-actions">
                    <button className="btn-edit" onClick={() => handleEdit(cat)}>✏️</button>
                    <button className="btn-delete" onClick={() => handleDelete(cat.id)}>🗑️</button>
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
                    placeholder="Enter category name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Enter description"
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