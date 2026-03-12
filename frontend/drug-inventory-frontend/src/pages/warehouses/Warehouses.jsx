import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { warehouseAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Warehouses.css';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editWarehouse, setEditWarehouse] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', location: '', city: '',
    state: '', capacity: '', isActive: true
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await warehouseAPI.getAll();
      setWarehouses(res.data);
    } catch (error) {
      toast.error('Failed to fetch warehouses!');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, capacity: parseInt(form.capacity) || 0 };
      if (editWarehouse) {
        await warehouseAPI.update(editWarehouse.id, payload);
        toast.success('Warehouse updated! ✅');
      } else {
        await warehouseAPI.create(payload);
        toast.success('Warehouse added! ✅');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Operation failed!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this warehouse?')) return;
    try {
      await warehouseAPI.delete(id);
      toast.success('Warehouse deleted! 🗑️');
      fetchData();
    } catch (error) {
      toast.error('Delete failed!');
    }
  };

  const handleEdit = (warehouse) => {
    setEditWarehouse(warehouse);
    setForm({
      name: warehouse.name || '',
      location: warehouse.location || '',
      city: warehouse.city || '',
      state: warehouse.state || '',
      capacity: warehouse.capacity || '',
      isActive: warehouse.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ name: '', location: '', city: '', state: '', capacity: '', isActive: true });
    setEditWarehouse(null);
  };

  const filtered = warehouses.filter(w =>
    w.name?.toLowerCase().includes(search.toLowerCase()) ||
    w.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>🏭 Warehouse Management</h1>
            <p>Manage all warehouses in the system</p>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            ➕ Add Warehouse
          </button>
        </div>

        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search warehouses by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading warehouses... ⏳</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Warehouse Name</th>
                  <th>Location</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">No warehouses found! Add your first warehouse. 🏭</td>
                  </tr>
                ) : (
                  filtered.map((warehouse, index) => (
                    <tr key={warehouse.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="item-name">
                          <span>🏭</span>
                          {warehouse.name}
                        </div>
                      </td>
                      <td>{warehouse.location || 'N/A'}</td>
                      <td>{warehouse.city || 'N/A'}</td>
                      <td>{warehouse.state || 'N/A'}</td>
                      <td>{warehouse.capacity || 0} units</td>
                      <td>
                        <span className={`badge ${warehouse.isActive ? 'badge-green' : 'badge-red'}`}>
                          {warehouse.isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => handleEdit(warehouse)}>✏️ Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(warehouse.id)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editWarehouse ? '✏️ Edit Warehouse' : '➕ Add New Warehouse'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Warehouse Name *</label>
                    <input
                      type="text"
                      placeholder="Enter warehouse name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Capacity (units)</label>
                    <input
                      type="number"
                      placeholder="Enter capacity"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Location / Address</label>
                  <textarea
                    placeholder="Enter full location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
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
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">
                    {editWarehouse ? '✅ Update Warehouse' : '➕ Add Warehouse'}
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

export default Warehouses;