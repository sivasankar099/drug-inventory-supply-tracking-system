import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, email: userEmail } = response.data;
      login({ email: userEmail }, token);
      toast.success('Login successful! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="login-left">
        <div className="login-left-content">
          <span className="logo">🏥</span>
          <h1>Drug Inventory & Supply Chain</h1>
          <p>Complete solution for managing drug inventory and tracking supply chain efficiently.</p>
          <div className="features">
            <div className="feature-item">
              <span>💊</span>
              <span>Real-time Drug Stock Management</span>
            </div>
            <div className="feature-item">
              <span>🚚</span>
              <span>Supply Chain Tracking</span>
            </div>
            <div className="feature-item">
              <span>⏰</span>
              <span>Expiry Alerts & Notifications</span>
            </div>
            <div className="feature-item">
              <span>📊</span>
              <span>Analytics & Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="login-box">
          <div className="login-header">
            <h2>Welcome Back! 👋</h2>
            <p>Sign in to your account to continue</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? '⏳ Signing in...' : '🚀 Sign In'}
            </button>
          </form>
          <div className="login-footer">
            <p>Drug Inventory & Supply Chain System v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;