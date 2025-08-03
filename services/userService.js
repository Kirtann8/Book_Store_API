const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDAO = require('../dao/userDAO');

exports.registerUser = async (name, email, password, role) => {
  try {
    const existingUser = await userDAO.findByEmail(email);
    if (existingUser) return null; // Indicates user already exists

    // Only allow 'admin' if explicitly requested, otherwise default to 'user'
    let userRole = 'user';
    if (role && role === 'admin') {
      userRole = 'admin';
    }

    const userData = { name, email, password, role: userRole };
    const user = await userDAO.create(userData);
    return user;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

exports.loginUser = async (email, password) => {
  try {
    const user = await userDAO.findByEmail(email);
    if (!user) return null; // Indicates user not found

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null; // Indicates invalid credentials

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    return token;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

exports.checkUserExists = async (email) => {
  try {
    const user = await userDAO.findByEmail(email);
    return !!user;
  } catch (error) {
    throw new Error(`Error checking user existence: ${error.message}`);
  }
};