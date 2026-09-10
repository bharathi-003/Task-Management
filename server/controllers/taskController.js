const Task = require('../models/Task');
const User = require('../models/User');
const {
  sendTaskAssignedEmail,
  sendStatusUpdatedEmail,
} = require('../services/emailService');

/**
 * @desc    Create and assign a new task
 * @route   POST /api/tasks
 * @access  Private (Admin only)
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority } = req.body;

    // Verify assigned employee exists and is an employee
    const employee = await User.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Assigned employee not found',
      });
    }

    if (employee.role !== 'employee') {
      return res.status(400).json({
        success: false,
        message: 'Tasks can only be assigned to users with the employee role',
      });
    }

    // Create task in MongoDB
    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      assignedTo,
      priority: priority || 'Medium',
      status: 'Not Started',
    });

    // Populate assigned employee details
    await task.populate('assignedTo', 'name email');

    // Trigger email notification to employee (non-blocking)
    sendTaskAssignedEmail({
      employeeName: employee.name,
      employeeEmail: employee.email,
      task,
    }).catch((err) => {
      console.error('[TaskController] Background email failed:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Task created and assigned successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks with search & pagination
 * @route   GET /api/tasks
 * @access  Private (Admin only)
 */
const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search ? req.query.search.trim() : '';
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      // Find matching employees by name or email
      const matchedEmployees = await User.find({
        role: 'employee',
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      const employeeIds = matchedEmployees.map((emp) => emp._id);

      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { assignedTo: { $in: employeeIds } },
        ],
      };
    }

    // Count total matching tasks
    const total = await Task.countDocuments(filter);
    const totalPages = Math.ceil(total / limit) || 1;

    // Fetch paginated tasks with populated employee info
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task statistics for Admin Dashboard
 * @route   GET /api/tasks/stats
 * @access  Private (Admin only)
 */
const getTaskStats = async (req, res, next) => {
  try {
    const notStarted = await Task.countDocuments({ status: 'Not Started' });
    const pending = await Task.countDocuments({ status: 'Pending' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const completed = await Task.countDocuments({ status: 'Completed' });
    const total = await Task.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        notStarted,
        pending,
        inProgress,
        pendingOrInProgress: pending + inProgress,
        completed,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tasks assigned to logged-in employee
 * @route   GET /api/tasks/my
 * @access  Private (Employee only)
 */
const getMyTasks = async (req, res, next) => {
  try {
    // Strictly enforce retrieval of only logged-in employee's tasks
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task status (Employee only, ownership enforced)
 * @route   PATCH /api/tasks/:id/status
 * @access  Private (Employee only)
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findById(id).populate('assignedTo', 'name email');
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Enforce ownership: employee can only update tasks assigned to them
    if (task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to update this task.',
      });
    }

    const previousStatus = task.status;
    task.status = status;
    await task.save();

    // Find admin email (or use environment default)
    const adminUser = await User.findOne({ role: 'admin' }).select('email');
    const adminEmail = adminUser?.email || process.env.ADMIN_EMAIL || 'admin@taskflow.com';

    // Trigger email notification to admin (non-blocking)
    sendStatusUpdatedEmail({
      employeeName: req.user.name,
      taskTitle: task.title,
      previousStatus,
      newStatus: status,
      adminEmail,
    }).catch((err) => {
      console.error('[TaskController] Background status email failed:', err.message);
    });

    return res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskStats,
  getMyTasks,
  updateTaskStatus,
};
