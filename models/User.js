const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['driver', 'conductor', 'admin'], default: 'driver' },
  profilePhoto: {
    type: String,
    default: '',
  },
  googleId: String,
});

module.exports = mongoose.model('User', userSchema);
