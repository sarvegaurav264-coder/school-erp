const User = require('../models/User');
const { asyncHandler } = require('../utils/helpers');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role, phone });
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      token,
      refreshToken
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(401).json({ success: false, message: 'Account is deactivated' });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar },
      token,
      refreshToken
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, data: user });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );
  res.json({ success: true, message: 'Profile updated', data: user });
});

// @desc    Change password
// @route   PUT /api/auth/password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  const token = user.getSignedJwtToken();

  res.json({ success: true, message: 'Password changed successfully', data: { token } });
});
