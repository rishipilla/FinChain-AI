const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const createToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: '7d' });
const userPayload = (user) => ({ id: user._id, name: user.name, email: user.email, profile: user.profile || {} });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
      return res.status(400).json({ msg: 'Name, email, and a password of at least 8 characters are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ msg: 'An account already exists for this email.' });

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      profile: { fullName: name.trim(), email: normalizedEmail },
    });
    return res.status(201).json({ token: createToken(user), user: userPayload(user) });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ msg: 'Invalid email or password.' });
    }
    return res.json({ token: createToken(user), user: userPayload(user) });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
