const User = require('../models/User');

/**
 * @desc    Create a new administrator account
 * @route   POST /api/admin/create
 * @access  Private (Admin only)
 */
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Create the admin account
    const admin = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'admin',
    });

    return res.status(201).json({
      success: true,
      message: 'New administrator account created successfully',
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all administrator accounts
 * @route   GET /api/admin/list
 * @access  Private (Admin only)
 */
const getAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an administrator account
 * @route   DELETE /api/admin/:id
 * @access  Private (Admin only)
 */
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Safety guard: Admin cannot delete their own account
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrator account',
      });
    }

    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found',
      });
    }

    if (admin.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Specified user is not an administrator',
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Administrator "${admin.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdmin,
  getAdmins,
  deleteAdmin,
};
