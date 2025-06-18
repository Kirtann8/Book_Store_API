const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) return null; // Indicates user already exists

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return user;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null; // Indicates user not found

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null; // Indicates invalid credentials

  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
  return token;
};

exports.checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
}; 