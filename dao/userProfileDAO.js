const User = require('../models/User');

exports.getProfile = async (userId) => {
  return await User.findById(userId).select('-password');
};

exports.updateProfile = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');
};

exports.changePassword = async (userId, hashedPassword) => {
  return await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  ).select('-password');
};