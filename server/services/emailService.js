const transporter = require('../config/mailer');

/**
 * Send email when Admin assigns a task to an employee
 */
const sendTaskAssignedEmail = async ({ employeeName, employeeEmail, task }) => {
  const subject = 'New Task Assigned to You';
  const assignedDate = new Date(task.createdAt || Date.now()).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const textContent = `
Hello ${employeeName},

A new task has been assigned to you on TaskFlow.

Task Title: ${task.title}
Description: ${task.description}
Priority: ${task.priority}
Status: ${task.status}
Assigned Date: ${assignedDate}

Please log in to your TaskFlow dashboard to view and manage your task:
${process.env.CLIENT_URL || 'http://localhost:5173'}

Best regards,
TaskFlow Team
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 20px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">TaskFlow &mdash; New Task Assigned</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hello <strong>${employeeName}</strong>,</p>
        <p>A new task has been assigned to you. Here are the task details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0; width: 30%;">Task Title</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${task.title}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;">Description</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${task.description}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;">Priority</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #ffffff; background-color: ${
                task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981'
              };">
                ${task.priority}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;">Status</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${task.status}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;">Assigned Date</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${assignedDate}</td>
          </tr>
        </table>

        <div style="margin-top: 24px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            View in Dashboard
          </a>
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;">
        TaskFlow Management System &copy; 2026
      </div>
    </div>
  `;

  if (!transporter) {
    console.log('\n--- [EMAIL SIMULATION: Task Assignment] ---');
    console.log(`To: ${employeeEmail} (${employeeName})`);
    console.log(`Subject: ${subject}`);
    console.log(`Task: ${task.title} | Priority: ${task.priority}`);
    console.log('-------------------------------------------\n');
    return { sent: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to: employeeEmail,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(`[Email] Task assigned email sent to ${employeeEmail}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error] Failed to send task assignment email: ${error.message}`);
    return { sent: false, error: error.message };
  }
};

/**
 * Send email when Employee updates task status
 */
const sendStatusUpdatedEmail = async ({
  employeeName,
  taskTitle,
  previousStatus,
  newStatus,
  adminEmail,
}) => {
  const subject = 'Task Status Updated';
  const updatedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const targetAdmin = adminEmail || process.env.ADMIN_EMAIL || 'admin@taskflow.com';

  const textContent = `
Hello Admin,

An employee has updated a task status on TaskFlow.

Employee: ${employeeName}
Task: ${taskTitle}
Previous Status: ${previousStatus}
New Status: ${newStatus}
Updated Date: ${updatedDate}

Please log in to your TaskFlow dashboard to view the latest status:
${process.env.CLIENT_URL || 'http://localhost:5173'}

Best regards,
TaskFlow Team
  `.trim();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f172a; padding: 20px; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">TaskFlow &mdash; Task Status Updated</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hello <strong>Admin</strong>,</p>
        <p>A task status has been updated by <strong>${employeeName}</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0; width: 30%;">Employee</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${employeeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;">Task</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${taskTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;">Previous Status</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #64748b;">${previousStatus}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;">New Status</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2563eb;">${newStatus}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0;">Updated Date</td>
            <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${updatedDate}</td>
          </tr>
        </table>

        <div style="margin-top: 24px;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Open Admin Dashboard
          </a>
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;">
        TaskFlow Management System &copy; 2026
      </div>
    </div>
  `;

  if (!transporter) {
    console.log('\n--- [EMAIL SIMULATION: Status Update] ---');
    console.log(`To: ${targetAdmin}`);
    console.log(`Subject: ${subject}`);
    console.log(`Employee: ${employeeName} | Task: ${taskTitle}`);
    console.log(`Previous: ${previousStatus} -> New: ${newStatus}`);
    console.log('-----------------------------------------\n');
    return { sent: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to: targetAdmin,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log(`[Email] Status update email sent to Admin: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error] Failed to send status update email: ${error.message}`);
    return { sent: false, error: error.message };
  }
};

module.exports = {
  sendTaskAssignedEmail,
  sendStatusUpdatedEmail,
};
