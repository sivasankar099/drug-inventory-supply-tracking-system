import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,158,11,${p.opacity})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(245,158,11,${0.08 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="particles-canvas" />
      <div className="bg-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Top bar */}
      <div className="login-topbar">
        <div className="topbar-logo">DrugTrack</div>
        <div className="topbar-badges">
          <span className="tbadge">Secure</span>
          <span className="tbadge">Real-time</span>
          <span className="tbadge">Pharma Grade</span>
        </div>
      </div>

      {/* Main */}
      <div className="login-content">

        {/* Left brand */}
        <div className="login-brand">
          <div className="brand-tag">SIH1627</div>
          <h1 className="brand-title">DrugTrack</h1>
          <p className="brand-subtitle">Drug Inventory & Supply Chain Management</p>

          <div className="brand-stats">
            <div className="bstat">
              <span className="bstat-num">10+</span>
              <span className="bstat-label">Modules</span>
            </div>
            <div className="bstat-divider" />
            <div className="bstat">
              <span className="bstat-num">100%</span>
              <span className="bstat-label">Secure</span>
            </div>
            <div className="bstat-divider" />
            <div className="bstat">
              <span className="bstat-num">24/7</span>
              <span className="bstat-label">Tracking</span>
            </div>
          </div>

          <div className="brand-features">
            {[
              'Real-time Inventory Tracking',
              'Drug Expiry Countdown Alerts',
              'Analytics & Reports',
              'Low Stock Notifications',
              'Multi-Warehouse Management',
              'Supplier Order Tracking',
            ].map((f, i) => (
              <div key={i} className="brand-feature" style={{ animationDelay: `${i * 0.1}s` }}>
                <span className="feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="login-form-wrapper">
          <div className="login-card">
            <div className="card-glow" />

            <div className="card-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access the system</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-box">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading
                  ? <span className="btn-loading"><span className="spinner" /> Signing in...</span>
                  : 'Sign In'}
              </button>
            </form>

            <div className="card-divider"><span>Access Levels</span></div>

            <div className="roles-grid">
              {[
                { role: 'Admin', color: '#f59e0b' },
                { role: 'Pharmacist', color: '#10b981' },
                { role: 'Supplier', color: '#3b82f6' },
                { role: 'Auditor', color: '#a78bfa' },
              ].map((r) => (
                <div key={r.role} className="role-chip" style={{ borderColor: r.color + '40', color: r.color }}>
                  {r.role}
                </div>
              ))}
            </div>

            <div className="card-footer">
              <p>New user?&nbsp;
                <button className="contact-link" onClick={() => setShowContact(!showContact)}>
                  Contact Administrator
                </button>
              </p>
            </div>

            {showContact && (
              <div className="contact-panel">
                <div className="contact-title">System Administrator</div>
                <div className="contact-row">admin@drugtrack.com</div>
                <div className="contact-row">+91 98765 43210</div>
                <div className="contact-row">Mon–Fri, 9AM – 6PM IST</div>
                <div className="contact-note">
                  Admin will create your account and provide login credentials securely.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="login-bottombar">
        © 2026 DrugTrack · SIH1627 · Built with React + Spring Boot
      </div>
    </div>
  );
};

export default Login;