import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { drugAPI, categoryAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Drugs.css';

const Drugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDrug, setEditDrug] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', manufacturer: '',
    unitPrice: '', categoryId: '', isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [drugsRes, categoriesRes] = await Promise.all([
        drugAPI.getAll(),
        categoryAPI.getAll()
      ]);
      setDrugs(drugsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        manufacturer: form.manufacturer,
        unitPrice: parseFloat(form.unitPrice) || 0,
        isActive: form.isActive,
        category: { id: parseInt(form.categoryId) }
      };
      if (editDrug) {
        await drugAPI.update(editDrug.id, payload);
        toast.success('Drug updated successfully! ✅');
      } else {
        await drugAPI.create(payload);
        toast.success('Drug added successfully! ✅');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Operation failed!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drug?')) return;
    try {
      await drugAPI.delete(id);
      toast.success('Drug deleted! 🗑️');
      fetchData();
    } catch (error) {
      toast.error('Delete failed!');
    }
  };

  const handleEdit = (drug) => {
    setEditDrug(drug);
    setForm({
      name: drug.name,
      description: drug.description || '',
      manufacturer: drug.manufacturer || '',
      unitPrice: drug.unitPrice || '',
      categoryId: drug.category?.id || '',
      isActive: drug.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ name: '', description: '', manufacturer: '', unitPrice: '', categoryId: '', isActive: true });
    setEditDrug(null);
  };

  const filteredDrugs = drugs.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.manufacturer?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>💊 Drug Management</h1>
            <p>Manage all drugs in the system</p>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            ➕ Add Drug
          </button>
        </div>

        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search drugs by name or manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading drugs... ⏳</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Drug Name</th>
                  <th>Category</th>
                  <th>Manufacturer</th>
                  <th>Unit Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrugs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">No drugs found! Add your first drug. 💊</td>
                  </tr>
                ) : (
                  filteredDrugs.map((drug, index) => (
                    <tr key={drug.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="drug-name">
                          <span className="drug-icon">💊</span>
                          {drug.name}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-blue">
                          {drug.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td>{drug.manufacturer || 'N/A'}</td>
                      <td>₹{drug.unitPrice || '0'}</td>
                      <td>
                        <span className={`badge ${drug.isActive ? 'badge-green' : 'badge-red'}`}>
                          {drug.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => handleEdit(drug)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(drug.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editDrug ? '✏️ Edit Drug' : '➕ Add New Drug'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Drug Name *</label>
                    <input
                      type="text"
                      placeholder="Enter drug name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Manufacturer</label>
                    <input
                      type="text"
                      placeholder="Enter manufacturer"
                      value={form.manufacturer}
                      onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      value={form.unitPrice}
                      onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                    />
                  </div>
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
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
                  >
                    <option value="true">✅ Active</option>
                    <option value="false">❌ Inactive</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editDrug ? '✅ Update Drug' : '➕ Add Drug'}
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

export default Drugs;