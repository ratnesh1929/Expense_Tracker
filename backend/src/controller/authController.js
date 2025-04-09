// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("📩 Received register request:", req.body);

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("⚠️ User already exists with email:", email);
      return res.status(400).json({ msg: 'User already exists.' });
    }

    const user = await User.create({ name, email, password });
    console.log("✅ User created successfully:", user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("🔥 Server error during registration:", err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ msg: 'Invalid credentials.' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
    
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};
