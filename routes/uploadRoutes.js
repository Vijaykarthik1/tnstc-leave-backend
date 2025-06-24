// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const upload = require('../middleware/uploadMiddleware');
const { authMiddleware } = require('../middleware/authMiddleware'); // (Optional, if you verify user)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/profile-photo', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'tnstc/profile_photos',
      },
      async (error, result) => {
        if (error) return res.status(500).json({ error: error.message });

        res.status(200).json({ imageUrl: result.secure_url });
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
