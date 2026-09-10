const express = require('express');
const router = express.Router();
const { getEmployees } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Admin only: view all employees and their task counts
router.get('/', protect, authorize('admin'), getEmployees);

module.exports = router;
