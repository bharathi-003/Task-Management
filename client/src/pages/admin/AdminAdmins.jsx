import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import CreateAdminModal from '../../components/CreateAdminModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';
import {
  ShieldCheck,
  UserPlus,
  RefreshCw,
  Mail,
  Shield,
  Trash2,
  AlertCircle,
  Sparkles,
  Key,
  Calendar,
  Lock,
} from 'lucide-react';

const AdminAdmins = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { success, error } = useToast();

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.get('/admin/list');
      if (res.data.success) {
        setAdmins(res.data.admins);
      }
    } catch (err) {
      console.error('Failed to load admins:', err);
      setErrorMsg(err.message || 'Unable to load administrators list.');
      error(err.message || 'Unable to load administrators list.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (adminId === currentUser?._id) {
      error('You cannot delete your own active administrator account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to revoke and delete administrator "${adminName}"?`)) {
      return;
    }

    try {
      setDeletingId(adminId);
      const res = await api.delete(`/admin/${adminId}`);
      if (res.data.success) {
        success(`Administrator "${adminName}" has been removed.`, 'Admin Removed');
        setAdmins((prev) => prev.filter((a) => a._id !== adminId));
      }
    } catch (err) {
      error(err.message || 'Failed to delete administrator');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                color: 'var(--primary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid rgba(124, 58, 237, 0.25)',
              }}
            >
              <ShieldCheck size={13} />
              <span>{admins.length} Active System Administrators</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Administrator Directory
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '3px' }}>
            Manage administrative credentials, onboard new system leaders, and oversee platform access.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={fetchAdmins}
            title="Refresh administrator directory"
            style={{ padding: '10px 16px', fontSize: '0.86rem' }}
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
            id="btn-create-admin"
            style={{ padding: '10px 20px', fontSize: '0.92rem' }}
          >
            <UserPlus size={16} strokeWidth={2.4} />
            <span>Create New Admin</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 'var(--radius-md)',
            color: '#be123c',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>{errorMsg}</span>
          <button
            onClick={fetchAdmins}
            style={{
              marginLeft: 'auto',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              color: '#be123c',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Highlights Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        <div className="stat-card glass-card" style={{ padding: '20px 22px' }}>
          <div className="stat-info">
            <span className="stat-label">Total Administrators</span>
            <span className="stat-value" style={{ color: 'var(--primary)' }}>
              {admins.length}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Users with full management privileges
            </span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(99, 102, 241, 0.25) 100%)',
              color: 'var(--primary)',
            }}
          >
            <Shield size={22} strokeWidth={2.3} />
          </div>
        </div>

        <div className="stat-card glass-card" style={{ padding: '20px 22px' }}>
          <div className="stat-info">
            <span className="stat-label">Your Account</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {currentUser?.name || 'Administrator'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {currentUser?.email}
            </span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
              color: '#059669',
            }}
          >
            <Key size={22} strokeWidth={2.3} />
          </div>
        </div>

        <div className="stat-card glass-card" style={{ padding: '20px 22px' }}>
          <div className="stat-info">
            <span className="stat-label">Access Level</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
              Tier 1 Unrestricted
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Can allocate, monitor & create accounts
            </span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(14, 165, 233, 0.25) 100%)',
              color: '#0284c7',
            }}
          >
            <Sparkles size={22} strokeWidth={2.3} />
          </div>
        </div>
      </div>

      {/* Admin Accounts Table */}
      <div className="card glass-card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={19} />
            </div>
            <div>
              <h3 className="card-title">System Administrators</h3>
              <div className="card-subtitle">Verified users possessing full access to system controls</div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <LoadingSpinner message="Retrieving administrator directory..." />
          ) : admins.length === 0 ? (
            <div className="empty-state">
              <Shield className="empty-state-icon" />
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                No administrators found
              </p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Click "+ Create New Admin" above to register an administrator.
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Administrator</th>
                  <th>Email Contact</th>
                  <th>Privilege Level</th>
                  <th>Account Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => {
                  const isCurrent = admin._id === currentUser?._id;
                  const isDeleting = deletingId === admin._id;

                  return (
                    <tr key={admin._id}>
                      <td>
                        <div className="table-user-cell">
                          <div
                            className="table-user-avatar"
                            style={{
                              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                              color: '#ffffff',
                              fontWeight: 800,
                              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
                            }}
                          >
                            {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                {admin.name}
                              </span>
                              {isCurrent && (
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    background: 'var(--primary-light)',
                                    color: 'var(--primary)',
                                    padding: '2px 7px',
                                    borderRadius: 'var(--radius-full)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Administrator Account
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <Mail size={14} color="var(--text-muted)" />
                          <span style={{ fontWeight: 500 }}>{admin.email}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.12) 100%)',
                            color: 'var(--primary)',
                            border: '1px solid rgba(124, 58, 237, 0.25)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          <Shield size={12} strokeWidth={2.4} />
                          <span>Full Admin</span>
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {formatDate(admin.createdAt)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isCurrent ? (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              fontWeight: 600,
                              fontStyle: 'italic',
                            }}
                          >
                            Active Session
                          </span>
                        ) : (
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleDeleteAdmin(admin._id, admin.name)}
                            disabled={isDeleting}
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.78rem',
                              color: '#be123c',
                              borderColor: '#fecdd3',
                              backgroundColor: '#fff1f2',
                            }}
                            title={`Revoke administrator account for ${admin.name}`}
                          >
                            {isDeleting ? (
                              <div className="spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />
                            ) : (
                              <>
                                <Trash2 size={13} />
                                <span>Remove</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAdmins}
      />
    </div>
  );
};

export default AdminAdmins;
