const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Task title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Assigned employee is required'],
    },
    priority: {
      type: String,
      required: [true, 'Task priority is required'],
      enum: {
        values: ['High', 'Medium', 'Low'],
        message: 'Priority must be High, Medium, or Low',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: ['Not Started', 'Pending', 'In Progress', 'Completed'],
        message: 'Status must be Not Started, Pending, In Progress, or Completed',
      },
      default: 'Not Started',
    },
  },
  {
    timestamps: true,
  }
);

// Add index on title and assignedTo for fast search and filtering
taskSchema.index({ title: 'text' });
taskSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
