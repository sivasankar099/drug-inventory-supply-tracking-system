import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { drugAPI, inventoryAPI, supplierAPI, warehouseAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    drugs: 0,
    suppliers: 0,
    warehouses: 0,
    lowStock: 0,
    expiring: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [drugs, suppliers, warehouses, lowStock, expiring] = await Promise.all([
          drugAPI.getAll(),
          supplierAPI.getAll(),
          warehouseAPI.getAll(),
          inventoryAPI.getLowStock(),
          inventoryAPI.getExpiring(),
        ]);
        setStats({
          drugs: drugs.data.length,
          suppliers: suppliers.data.length,
          warehouses: warehouses.data.length,
          lowStock: lowStock.data.length,
          expiring: expiring.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Drugs', value: stats.drugs, icon: '💊', color: '#3b82f6', bg: '#1e3a5f' },
    { title: 'Suppliers', value: stats.suppliers, icon: '🚚', color: '#10b981', bg: '#064e3b' },
    { title: 'Warehouses', value: stats.warehouses, icon: '🏭', color: '#8b5cf6', bg: '#3b0764' },
    { title: 'Low Stock', value: stats.lowStock, icon: '⚠️', color: '#f59e0b', bg: '#451a03' },
    { title: 'Expiring Soon', value: stats.expiring, icon: '⏰', color: '#ef4444', bg: '#450a0a' },
  ];

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard 📊</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <div className="date-badge">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading dashboard... ⏳</div>
        ) : (
          <>
            <div className="stats-grid">
              {statCards.map((card, index) => (
                <div
                  key={index}
                  className="stat-card"
                  style={{ borderColor: card.color }}
                >
                  <div className="stat-icon" style={{ background: card.bg }}>
                    {card.icon}
                  </div>
                  <div className="stat-info">
                    <h3>{card.value}</h3>
                    <p>{card.title}</p>
                  </div>
                  <div className="stat-bar" style={{ background: card.color }}></div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>📋 Quick Actions</h3>
                <div className="quick-actions">
                  <a href="/drugs" className="action-btn">➕ Add Drug</a>
                  <a href="/inventory" className="action-btn">📦 Add Inventory</a>
                  <a href="/suppliers" className="action-btn">🚚 Add Supplier</a>
                  <a href="/warehouses" className="action-btn">🏭 Add Warehouse</a>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>🔔 System Status</h3>
                <div className="status-list">
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>Backend API — Online</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>Database — Connected</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot yellow"></span>
                    <span>Low Stock Items — {stats.lowStock}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot red"></span>
                    <span>Expiring Soon — {stats.expiring}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;