import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Sidebar.css';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/drugs', icon: '💊', label: 'Drugs' },
    { path: '/categories', icon: '🗂️', label: 'Categories' },
    { path: '/inventory', icon: '📦', label: 'Inventory' },
    { path: '/suppliers', icon: '🚚', label: 'Suppliers' },
    { path: '/warehouses', icon: '🏭', label: 'Warehouses' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">🏥</span>
        <div>
          <h2>DrugTrack</h2>
          <p>Supply Chain System</p>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <p className="user-email">{user?.email}</p>
          <p className="user-role">Administrator</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MAIN MENU</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;