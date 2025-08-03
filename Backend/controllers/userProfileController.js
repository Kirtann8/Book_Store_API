const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middlewares/errorMiddleware');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    res.json(user);
  } catch (err) {
    next(new AppError('Failed to fetch profile', 500));
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.password) delete updates.password;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    res.json({ status: 'success', user });
  } catch (err) {
    next(new AppError('Failed to update profile', 500));
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('User not found', 404));
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) return next(new AppError('Current password is incorrect', 400));
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    res.json({ status: 'success', message: 'Password updated successfully' });
  } catch (err) {
    next(new AppError('Failed to change password', 500));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(new AppError('Failed to fetch users', 500));
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    res.json(user);
  } catch (err) {
    next(new AppError('Failed to fetch user', 500));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.password) delete updates.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    res.json({ status: 'success', user });
  } catch (err) {
    next(new AppError('Failed to update user', 500));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    next(new AppError('Failed to delete user', 500));
  }
};
