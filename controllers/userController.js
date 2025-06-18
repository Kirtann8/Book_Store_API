const userService = require('../services/userService');

// Register New User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.registerUser(name, email, password);

    if (!user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);

    if (!token) {
      // This handles both user not found and invalid credentials
      const userExists = await userService.checkUserExists(email);
      if (userExists) {
        return res.status(400).json({ message: 'Invalid credentials' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
