const User = require('../models/User');
const Task = require('../models/Task');

/**
 * @desc    Get all employees with their task statistics
 * @route   GET /api/employees
 * @access  Private (Admin only)
 */
const getEmployees = async (req, res, next) => {
  try {
    // Retrieve all users with employee role
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate task statistics per employee
    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
          pendingTasks: {
            $sum: {
              $cond: [
                { $in: ['$status', ['Pending', 'In Progress']] },
                1,
                0,
              ],
            },
          },
          notStartedTasks: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Not Started'] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Map stats into a quick lookup dictionary by employee ID string
    const statsMap = {};
    taskStats.forEach((stat) => {
      statsMap[stat._id.toString()] = {
        totalTasks: stat.totalTasks || 0,
        completedTasks: stat.completedTasks || 0,
        pendingTasks: stat.pendingTasks || 0,
        notStartedTasks: stat.notStartedTasks || 0,
      };
    });

    // Merge stats with employee objects
    const employeesWithStats = employees.map((emp) => {
      const stats = statsMap[emp._id.toString()] || {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        notStartedTasks: 0,
      };

      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt,
        totalTasks: stats.totalTasks,
        pendingTasks: stats.pendingTasks,
        completedTasks: stats.completedTasks,
        notStartedTasks: stats.notStartedTasks,
      };
    });

    return res.status(200).json({
      success: true,
      count: employeesWithStats.length,
      employees: employeesWithStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
};
