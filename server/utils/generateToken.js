const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET || 'fallback_secret_taskflow_jwt_2026',
    {
      expiresIn: '7d',
    }
  );
};

module.exports = generateToken;
