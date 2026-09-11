import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { StatusBadge, PriorityBadge } from '../../components/TaskBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { TASK_STATUSES } from '../../utils/constants';
import { CheckSquare, AlertCircle, RefreshCw, Calendar, Clock, Layers, Sparkles } from 'lucide-react';

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { success, error } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.get('/tasks/my');
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Failed to load my tasks:', err);
      setErrorMsg(err.message || 'Unable to load your assigned tasks.');
      error(err.message || 'Unable to load your assigned tasks.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);
      const res = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      if (res.data.success) {
        success(`Task status updated to "${newStatus}". Administrator notified via email.`, 'Status Updated');
        // Update local state
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
          )
        );
      }
    } catch (err) {
      error(err.message || 'Failed to update task status');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div>
      {/* Header */}
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
              <Layers size={13} />
              <span>{tasks.length} Assigned Deliverables</span>
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            My Assigned Tasks
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '3px' }}>
            Review requirements, monitor completion milestones, and update deliverable status in real-time.
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={fetchTasks}
          title="Refresh task list"
          style={{ padding: '9px 16px', fontSize: '0.86rem' }}
        >
          <RefreshCw size={15} />
          <span>Refresh Tasks</span>
        </button>
      </div>

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
            onClick={fetchTasks}
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

      {loading ? (
        <LoadingSpinner message="Retrieving your assigned task cards..." />
      ) : tasks.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px' }}>
          <div className="empty-state">
            <CheckSquare className="empty-state-icon" />
            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>No tasks assigned</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
              You do not have any active tasks assigned at this moment. You will receive an email notification when a new task is assigned to you.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {tasks.map((task) => {
            const isUpdating = updatingTaskId === task._id;

            return (
              <div key={task._id} className="employee-task-card glass-card">
                <div className="task-card-header">
                  <h3 className="task-card-title">{task.title}</h3>
                  <PriorityBadge priority={task.priority} />
                </div>

                <p className="task-card-desc">{task.description}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                    Status:
                  </span>
                  <StatusBadge status={task.status} />
                </div>

                <div className="task-card-footer">
                  <div className="task-date-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} color="var(--text-muted)" />
                      <span>Assigned: {formatDate(task.createdAt)}</span>
                    </div>
                    {task.updatedAt && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                        <Clock size={13} color="var(--text-muted)" />
                        <span>Updated: {formatDate(task.updatedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="task-status-control">
                    <label
                      htmlFor={`status-${task._id}`}
                      style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}
                    >
                      Update:
                    </label>
                    <select
                      id={`status-${task._id}`}
                      className="status-select"
                      value={task.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      {TASK_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    {isUpdating && (
                      <div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeTasks;
