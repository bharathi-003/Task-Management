import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';
import {
  X,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  KeyRound,
} from 'lucide-react';

const CreateAdminModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { success, error } = useToast();

  if (!isOpen) return null;

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: '#f43f5e' };
    if (score <= 4) return { score: 2, label: 'Good', color: '#f59e0b' };
    return { score: 3, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength();

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const res = await api.post('/admin/create', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data.success) {
        success(
          `Administrator account for "${res.data.admin?.name || name}" created successfully!`,
          'Admin Created'
        );
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      error(err.message || 'Failed to create administrator account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <h2 className="modal-title">Create Admin Account</h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Grant full administrative privileges to a new team supervisor or system owner.
            </p>
          </div>

          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="admin-name">
                Full Name <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={17}
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
                  id="admin-name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="e.g., Alexandra Vance"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                />
              </div>
              {errors.name && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">
                Email Address <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
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
                  id="admin-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '42px' }}
                  placeholder="admin.alex@taskflow.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                />
              </div>
              {errors.email && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">
                Password <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
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
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  placeholder="Min 6 characters"
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
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Strength:</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      background: '#e2e8f0',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${(strength.score / 3) * 100}%`,
                        background: strength.color,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="admin-confirm-password">
                Confirm Password <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound
                  size={17}
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
                  id="admin-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* Privilege Notice Banner */}
            <div
              style={{
                marginTop: '18px',
                padding: '12px 14px',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
              }}
            >
              <Sparkles size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Administrative Privileges:</strong>{' '}
                This account can assign and monitor tasks across all team members, view organizational analytics, and register additional administrators.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Create Administrator</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;
