import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';
import { TASK_PRIORITIES } from '../utils/constants';
import { X, Plus, AlertCircle, Sparkles, CheckCircle2, User, FileText, Flag } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [employees, setEmployees] = useState([]);

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { success, error } = useToast();

  // Fetch employees list when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        try {
          setLoadingEmployees(true);
          const res = await api.get('/employees');
          if (res.data.success) {
            setEmployees(res.data.employees);
            if (res.data.employees.length > 0 && !assignedTo) {
              setAssignedTo(res.data.employees[0]._id);
            }
          }
        } catch (err) {
          error(err.message || 'Failed to fetch employees list');
        } finally {
          setLoadingEmployees(false);
        }
      };

      fetchEmployees();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Task title is required';
    } else if (title.trim().length > 150) {
      errs.title = 'Task title cannot exceed 150 characters';
    }

    if (!description.trim()) {
      errs.description = 'Task description is required';
    }

    if (!assignedTo) {
      errs.assignedTo = 'Please select an employee to assign this task to';
    }

    if (!priority) {
      errs.priority = 'Priority is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        assignedTo,
        priority,
      };

      const res = await api.post('/tasks', payload);
      if (res.data.success) {
        success('Task assigned successfully! Notification email queued.', 'Task Created');
        // Reset form
        setTitle('');
        setDescription('');
        setPriority('Medium');
        setErrors({});
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      error(err.message || 'Unable to assign task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={18} strokeWidth={2.5} />
              </div>
              <h2 className="modal-title">Assign New Task</h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              Create and delegate an actionable deliverable to a team member.
            </p>
          </div>

          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Task Title */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label className="form-label" htmlFor="task-title" style={{ margin: 0 }}>
                  Task Title <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <span style={{ fontSize: '0.74rem', color: title.length > 130 ? '#e11d48' : 'var(--text-muted)' }}>
                  {title.length}/150
                </span>
              </div>
              <input
                id="task-title"
                type="text"
                className="form-input"
                placeholder="e.g., Audit user authentication flow and optimize token refreshing"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                maxLength={150}
              />
              {errors.title && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Task Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">
                Task Description <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <textarea
                id="task-desc"
                className="form-textarea"
                placeholder="Detail technical requirements, expected deliverables, and acceptance criteria..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
              />
              {errors.description && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>

            {/* Assignee and Priority Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* Assigned Employee */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="task-employee">
                  Assign To <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <select
                  id="task-employee"
                  className="form-select"
                  value={assignedTo}
                  onChange={(e) => {
                    setAssignedTo(e.target.value);
                    if (errors.assignedTo) setErrors((prev) => ({ ...prev, assignedTo: '' }));
                  }}
                  disabled={loadingEmployees}
                >
                  {loadingEmployees ? (
                    <option value="">Loading employee directory...</option>
                  ) : employees.length === 0 ? (
                    <option value="">No registered employees available</option>
                  ) : (
                    employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))
                  )}
                </select>
                {errors.assignedTo && (
                  <div className="form-error">
                    <AlertCircle size={14} />
                    <span>{errors.assignedTo}</span>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="task-priority">
                  Priority Level <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <select
                  id="task-priority"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {TASK_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p} Priority
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <div className="form-error">
                    <AlertCircle size={14} />
                    <span>{errors.priority}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Helper Status Note */}
            <div
              style={{
                marginTop: '20px',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                background: '#f8fafc',
                border: '1px solid var(--border-light)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <Sparkles size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Automatic Notification:</strong> Once assigned, the default status will be set to{' '}
                <span className="badge badge-status-not-started" style={{ padding: '2px 8px', fontSize: '0.74rem' }}>
                  Not Started
                </span>{' '}
                and an email will automatically be dispatched to the selected team member.
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
              disabled={submitting || loadingEmployees || employees.length === 0}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: 15, height: 15, borderWidth: 2 }} />
                  <span>Assigning Deliverable...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Assign Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
