import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Layers, Mail, Lock, LogIn, ShieldCheck, CheckCircle2, ArrowRight, Eye, EyeOff, Sparkles, UserCheck, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const result = await login(email, password);

      if (result.success) {
        success(`Welcome back, ${result.user.name}!`, 'Authentication Successful');

        // Redirect based on role
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/employee/dashboard', { replace: true });
        }
      } else {
        error(result.message || 'Invalid email or password');
        setErrors({ general: result.message || 'Invalid email or password' });
      }
    } catch (err) {
      error(err.message || 'Login failed. Please try again.');
      setErrors({ general: err.message || 'Login failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
  };

  return (
    <div className="auth-page">
      {/* Left Brand Panel (High-End SaaS Visual) */}
      <div className="auth-sidebar">
        <div>
          <div className="brand-logo" style={{ marginBottom: '48px' }}>
            <div className="brand-icon" style={{ width: '44px', height: '44px' }}>
              <Layers size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="brand-title" style={{ color: '#ffffff', fontSize: '1.45rem' }}>
                TaskFlow
              </span>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', letterSpacing: '0.06em', fontWeight: 700 }}>
                TASK MANAGEMENT SYSTEM
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              color: '#a5b4fc',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <Sparkles size={14} />
            <span>Enterprise Workspace 2.0</span>
          </div>

          <h2 style={{ fontSize: '2.15rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '18px', color: '#ffffff', letterSpacing: '-0.03em' }}>
            Orchestrate deliverables with velocity and clarity
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.65, maxWidth: '440px' }}>
            A unified, role-based platform for organizing assignments, prioritizing critical deliverables, and accelerating cross-functional teamwork.
          </p>

          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={16} color="#10b981" />
              </div>
              <span>Real-time completion metrics & live deliverable velocity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={16} color="#10b981" />
              </div>
              <span>Granular Role-Based Access Control (Admin & Team Members)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={16} color="#10b981" />
              </div>
              <span>Automated transactional notifications & email logging</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={15} color="#475569" />
          <span>TaskFlow Enterprise Edition &bull; 2026</span>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Sign in to your account</h1>
            <p className="auth-subtitle">
              Enter your credentials to access your TaskFlow dashboard.
            </p>
          </div>

          {errors.general && (
            <div
              style={{
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                color: '#be123c',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="email-input"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="name@taskflow.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', marginTop: '10px', fontSize: '0.96rem' }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} strokeWidth={2.4} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts Quick-Fill Box */}
          <div className="demo-credentials-box">
            <div className="demo-credentials-title">
              <ShieldCheck size={18} color="var(--primary)" />
              <span>Demo Accounts (Instant Fill)</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '8px' }}>
              Click any role to automatically populate demo credentials:
            </p>
            <div className="demo-btn-group">
              <button
                type="button"
                className="demo-btn"
                onClick={() => fillDemo('admin@taskflow.com', 'Admin@123')}
              >
                Admin Demo
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => fillDemo('john.doe@taskflow.com', 'Employee@123')}
              >
                Employee 1 (John)
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => fillDemo('jane.smith@taskflow.com', 'Employee@123')}
              >
                Employee 2 (Jane)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
