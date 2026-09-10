const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskStats,
  getMyTasks,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  validateCreateTask,
  validateStatusUpdate,
} = require('../middleware/validate');

// All task routes require authentication
router.use(protect);

// Admin-only: Get task statistics for dashboard
router.get('/stats', authorize('admin'), getTaskStats);

// Employee-only: Get current employee's assigned tasks
router.get('/my', authorize('employee'), getMyTasks);

// Admin-only: List all tasks with search & pagination
router.get('/', authorize('admin'), getTasks);

// Admin-only: Create and assign task
router.post('/', authorize('admin'), validateCreateTask, createTask);

// Employee-only: Update task status (ownership enforced in controller)
router.patch('/:id/status', authorize('employee'), validateStatusUpdate, updateTaskStatus);

module.exports = router;
