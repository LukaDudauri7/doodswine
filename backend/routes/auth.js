const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require("jsonwebtoken");

router.get('/test', async (req, res) => {
  console.log("TEST REQUEST");
  return res.status(201).json({ message: 'Fill in all fields' });
});

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword)
    return res.status(400).json({ message: 'Fill in all fields' });
  if (password !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  console.log("LOGIN REQUEST:", req.body);

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Fill in all fields' });

  try {
    const user = await User.findOne({ email });
    console.log("FOUND USER:", user);

    if (!user)
      return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH?", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // 🔥  JWT TOKEN
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
