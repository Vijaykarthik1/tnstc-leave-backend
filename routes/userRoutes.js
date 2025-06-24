// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ PATCH: Update user profile photo
router.patch('/:id/profile-photo', async (req, res) => {
  const { id } = req.params;
  const { profilePhoto } = req.body;

  try {
    if (!profilePhoto) {
      return res.status(400).json({ error: 'No profile photo provided' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePhoto },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile photo updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Error updating profile photo:', err);
    res.status(500).json({ error: 'Failed to update profile photo' });
  }
});

module.exports = router;
