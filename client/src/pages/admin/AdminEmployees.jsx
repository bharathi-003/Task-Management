import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';
import { Users, Mail, CheckCircle2, Clock, ListOrdered, AlertCircle, RefreshCw, Sparkles, UserCheck } from 'lucide-react';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const { error } = useToast();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.get('/employees');

      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
      setErrorMsg(err.message || 'Unable to load employees list.');
      error(err.message || 'Unable to load employees list.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div>
      {/* Header and Refresh */}
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
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <UserCheck size={13} />
              <span>{employees.length} Team Members</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Employee Directory
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '3px' }}>
            Monitor organizational team members, task allocation load, and completion performance.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={fetchEmployees}
          title="Refresh employee directory"
          style={{ padding: '9px 16px', fontSize: '0.86rem' }}
        >
          <RefreshCw size={15} />
          <span>Refresh Directory</span>
        </button>
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
            onClick={fetchEmployees}
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

      {/* Employee Table Card */}
      <div className="card glass-card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <Users size={18} />
            </div>
            <div>
              <h3 className="card-title">Active Team Members</h3>
              <div className="card-subtitle">Real-time aggregate metrics for individual employee deliverables</div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <LoadingSpinner message="Loading employee directory and workload analytics..." />
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <Users className="empty-state-icon" />
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>No employees found</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Run the database seed script or create employee accounts to see them listed here.
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Email Contact</th>
                  <th style={{ textAlign: 'center' }}>Total Deliverables</th>
                  <th style={{ textAlign: 'center' }}>In Progress / Pending</th>
                  <th style={{ textAlign: 'center' }}>Completed Deliverables</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="table-user-cell">
                        <div
                          className="table-user-avatar"
                          style={{
                            background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
                            color: 'var(--primary)',
                            fontWeight: 800,
                          }}
                        >
                          {emp.name ? emp.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Employee</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        <Mail size={14} color="var(--text-muted)" />
                        <span>{emp.email}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-primary)',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        {emp.totalTasks || 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          color: '#b45309',
                          backgroundColor: 'var(--status-pending-bg)',
                          border: '1px solid var(--status-pending-border)',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {emp.pendingTasks || 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          color: '#047857',
                          backgroundColor: 'var(--status-completed-bg)',
                          border: '1px solid var(--status-completed-border)',
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {emp.completedTasks || 0}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {formatDate(emp.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;
