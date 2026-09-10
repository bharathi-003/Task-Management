const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Task = require('../models/Task');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow_db';
    console.log(`[Seed] Connecting to database: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing Users and Tasks...');
    await Task.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Creating demo users...');

    // Admin user (password will be hashed by User pre-save hook)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@taskflow.com',
      password: 'Admin@123',
      role: 'admin',
    });

    // Employee 1: John Doe
    const employee1 = await User.create({
      name: 'John Doe',
      email: 'john.doe@taskflow.com',
      password: 'Employee@123',
      role: 'employee',
    });

    // Employee 2: Jane Smith
    const employee2 = await User.create({
      name: 'Jane Smith',
      email: 'jane.smith@taskflow.com',
      password: 'Employee@123',
      role: 'employee',
    });

    // Employee 3: Robert Brown
    const employee3 = await User.create({
      name: 'Robert Brown',
      email: 'robert.brown@taskflow.com',
      password: 'Employee@123',
      role: 'employee',
    });

    console.log('[Seed] Users created successfully:');
    console.log(`  - Admin: ${admin.email} (Password: Admin@123)`);
    console.log(`  - Employee 1: ${employee1.email} (Password: Employee@123)`);
    console.log(`  - Employee 2: ${employee2.email} (Password: Employee@123)`);
    console.log(`  - Employee 3: ${employee3.email} (Password: Employee@123)`);

    console.log('[Seed] Creating initial demo tasks...');

    const sampleTasks = [
      {
        title: 'Design Authentication Flow',
        description: 'Design secure JWT authentication with refresh token strategy and password hashing.',
        assignedTo: employee1._id,
        priority: 'High',
        status: 'Completed',
      },
      {
        title: 'Develop Employee Directory Table',
        description: 'Create responsive data table with employee stats, status indicators, and mobile view.',
        assignedTo: employee1._id,
        priority: 'Medium',
        status: 'In Progress',
      },
      {
        title: 'Configure Nodemailer SMTP Transport',
        description: 'Set up transactional email delivery for task assignment and status updates with fallback.',
        assignedTo: employee1._id,
        priority: 'High',
        status: 'Pending',
      },
      {
        title: 'Build Role-Based Route Guards',
        description: 'Implement frontend and backend authorization middleware for admin and employee roles.',
        assignedTo: employee2._id,
        priority: 'High',
        status: 'Completed',
      },
      {
        title: 'Implement Task Pagination & Search API',
        description: 'Build backend pagination with limit/page parameters and regex search across titles and names.',
        assignedTo: employee2._id,
        priority: 'Medium',
        status: 'In Progress',
      },
      {
        title: 'Design Dashboard Statistics Cards',
        description: 'Display live MongoDB aggregated counts for Not Started, Pending/In Progress, and Completed.',
        assignedTo: employee2._id,
        priority: 'Low',
        status: 'Not Started',
      },
      {
        title: 'Perform Cross-Browser Testing & Polish',
        description: 'Ensure layout responsiveness, touch targets, and visual consistency across all viewports.',
        assignedTo: employee3._id,
        priority: 'Low',
        status: 'Not Started',
      },
      {
        title: 'Prepare API Documentation & README',
        description: 'Document endpoints, request/response formats, environment variables, and setup instructions.',
        assignedTo: employee3._id,
        priority: 'Medium',
        status: 'Pending',
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log(`[Seed] Successfully seeded ${sampleTasks.length} demo tasks.`);

    console.log('\n[Seed] Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
