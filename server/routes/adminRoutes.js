const express = require('express');
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  deleteAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateCreateAdmin } = require('../middleware/validate');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Create a new administrator account
router.post('/create', validateCreateAdmin, createAdmin);

// List all administrator accounts
router.get('/list', getAdmins);

// Delete an administrator account (self-deletion prevented)
router.delete('/:id', deleteAdmin);

module.exports = router;
