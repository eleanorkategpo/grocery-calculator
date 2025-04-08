import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Set JWT cookie
export const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);
  
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode)
    .cookie('jwt', token, cookieOptions)
    .json({
      status: 'success',
      token,
      data: {
        user
      }
    });
}; 