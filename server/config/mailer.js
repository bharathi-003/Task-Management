const nodemailer = require('nodemailer');

const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass) {
    return nodemailer.createTransport({
      service: 'gmail', // or standard SMTP host/port if specified
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // If credentials are not configured, return null to signify simulation mode
  return null;
};

const transporter = createTransporter();

module.exports = transporter;
