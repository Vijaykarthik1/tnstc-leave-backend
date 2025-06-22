const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  fullName: String,
  role: String,
  routeFrom: String,
  routeTo: String,
  fromDate: Date,
  toDate: Date,
  leaveType: String,
  reason: String,
  status: {
    type: String,
    default: 'Pending', // Pending | Approved | Rejected
  },
  reliever: {
    type: String,
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
