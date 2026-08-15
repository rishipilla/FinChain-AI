const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile || {},
      settings: user.settings || {},
      itrProfile: user.itrProfile || {},
      annualIncome: user.annualIncome || 0,
      investments80C: user.investments80C || 0,
    };

    res.json(payload);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { profile, settings, name } = req.body;

    const update = {};
    if (name) update.name = name;
    if (profile) update.profile = profile;
    if (settings) update.settings = settings;

    const user = await User.findByIdAndUpdate(req.user.id, { $set: update }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      msg: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile || {},
        settings: user.settings || {},
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
