import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { inventoryAPI, drugAPI, warehouseAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Inventory.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [form, setForm] = useState({
    drugId: '', warehouseId: '', quantity: '',
    minStockLevel: '', expiryDate: '', batchNumber: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [invRes, drugsRes, warehousesRes] = await Promise.all([
        inventoryAPI.getAll(),
        drugAPI.getAll(),
        warehouseAPI.getAll()
      ]);
      setInventory(invRes.data);
      setDrugs(drugsRes.data);
      setWarehouses(warehousesRes.data);
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
        quantity: parseInt(form.quantity),
        minStockLevel: parseInt(form.minStockLevel) || 10,
        expiryDate: form.expiryDate,
        batchNumber: form.batchNumber,
        drug: { id: parseInt(form.drugId) },
        warehouse: { id: parseInt(form.warehouseId) }
      };
      await inventoryAPI.create(payload);
      toast.success('Inventory added! ✅');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Operation failed!');
    }
  };

  const resetForm = () => {
    setForm({ drugId: '', warehouseId: '', quantity: '', minStockLevel: '', expiryDate: '', batchNumber: '' });
  };

  const getFilteredInventory = () => {
    let filtered = inventory;
    if (activeTab === 'low') filtered = inventory.filter(i => i.quantity <= (i.minStockLevel || 10));
    if (activeTab === 'expiring') {
      const thirtyDays = new Date();
      thirtyDays.setDate(thirtyDays.getDate() + 30);
      filtered = inventory.filter(i => i.expiryDate && new Date(i.expiryDate) <= thirtyDays);
    }
    return filtered.filter(i =>
      i.drug?.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.warehouse?.name?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getStockStatus = (item) => {
    if (item.quantity <= 0) return { label: '❌ Out of Stock', class: 'badge-red' };
    if (item.quantity <= (item.minStockLevel || 10)) return { label: '⚠️ Low Stock', class: 'badge-yellow' };
    return { label: '✅ In Stock', class: 'badge-green' };
  };

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>📦 Inventory Management</h1>
            <p>Track and manage drug stock levels</p>
          </div>
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            ➕ Add Stock
          </button>
        </div>

        <div className="inventory-tabs">
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            📦 All Stock ({inventory.length})
          </button>
          <button className={`tab ${activeTab === 'low' ? 'active' : ''}`} onClick={() => setActiveTab('low')}>
            ⚠️ Low Stock
          </button>
          <button className={`tab ${activeTab === 'expiring' ? 'active' : ''}`} onClick={() => setActiveTab('expiring')}>
            ⏰ Expiring Soon
          </button>
        </div>

        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search by drug or warehouse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Loading inventory... ⏳</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Drug Name</th>
                  <th>Warehouse</th>
                  <th>Batch No</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Stock Status</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredInventory().length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">No inventory found! Add stock. 📦</td>
                  </tr>
                ) : (
                  getFilteredInventory().map((item, index) => {
                    const status = getStockStatus(item);
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="item-name">
                            <span>💊</span>
                            {item.drug?.name || 'N/A'}
                          </div>
                        </td>
                        <td>{item.warehouse?.name || 'N/A'}</td>
                        <td>{item.batchNumber || 'N/A'}</td>
                        <td>
                          <span className="quantity">{item.quantity}</span>
                        </td>
                        <td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-IN') : 'N/A'}</td>
                        <td>
                          <span className={`badge ${status.class}`}>{status.label}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>➕ Add Stock</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Drug *</label>
                    <select
                      value={form.drugId}
                      onChange={(e) => setForm({ ...form, drugId: e.target.value })}
                      required
                    >
                      <option value="">Select Drug</option>
                      {drugs.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Warehouse *</label>
                    <select
                      value={form.warehouseId}
                      onChange={(e) => setForm({ ...form, warehouseId: e.target.value })}
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Min Stock Level</label>
                    <input
                      type="number"
                      placeholder="Minimum stock level"
                      value={form.minStockLevel}
                      onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Batch Number</label>
                    <input
                      type="text"
                      placeholder="Enter batch number"
                      value={form.batchNumber}
                      onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={form.expiryDate}
                      onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">➕ Add Stock</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Inventory;