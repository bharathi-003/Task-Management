const mongoose = require('mongoose');

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate login request
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  if (!isValidEmail(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  if (!password || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

  next();
};

// Validate task creation
const validateCreateTask = (req, res, next) => {
  const { title, description, assignedTo, priority } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Task title is required',
    });
  }

  if (title.trim().length > 150) {
    return res.status(400).json({
      success: false,
      message: 'Task title cannot exceed 150 characters',
    });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Task description is required',
    });
  }

  if (!assignedTo) {
    return res.status(400).json({
      success: false,
      message: 'Assigned employee is required',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee identifier provided',
    });
  }

  const validPriorities = ['High', 'Medium', 'Low'];
  if (!priority || !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Priority must be one of: High, Medium, Low',
    });
  }

  next();
};

// Validate status update
const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Not Started', 'Pending', 'In Progress', 'Completed'];

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Status is required',
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be one of: Not Started, Pending, In Progress, Completed',
    });
  }

  next();
};

module.exports = {
  validateLogin,
  validateCreateTask,
  validateStatusUpdate,
};
