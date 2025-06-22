const express = require('express');
const { applyLeave } = require('../controllers/leaveController');
const Leave = require('../models/leaveModel');
// const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Apply for leave
router.post('/apply', applyLeave);

// Get leaves for a specific user
router.get('/user/:id', async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.params.id });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

// Get all leave requests (for admin)
router.get('/all', async (req, res) => {
  try {
    const leaves = await Leave.find().populate('userId', 'name email role');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all leaves' });
  }
});

// Update leave status and send email notification
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id).populate('userId');

    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    leave.status = status;
    await leave.save();

    // Send email
    const to = leave.userId.email;
    const subject = `Leave ${status}`;
    const message = `Hello ${leave.fullName}, your leave from ${leave.fromDate.toDateString()} to ${leave.toDate.toDateString()} has been ${status}.`;

    // await sendEmail(to, subject, message);

    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Admin leave summary (total, approved, pending, rejected)
router.get('/summary', async (req, res) => {
  try {
    const [total, approved, pending, rejected] = await Promise.all([
      Leave.countDocuments(),
      Leave.countDocuments({ status: 'Approved' }),
      Leave.countDocuments({ status: 'Pending' }),
      Leave.countDocuments({ status: 'Rejected' }),
    ]);

    // ✅ Log summary values to the backend console
    console.log('Summary Counts', { total, approved, pending, rejected });

    res.json({ total, approved, pending, rejected });
  } catch (err) {
    console.error('Error getting summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});


module.exports = router;
