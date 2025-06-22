const Leave = require('../models/leaveModel');

const applyLeave = async (req, res) => {
  try {
    const leave = new Leave({
      ...req.body,
      status: 'Pending' // ✅ ensure default status is always set
    });
    await leave.save();
    res.status(201).json({ message: 'Leave applied successfully' });
  } catch (error) {
    console.error('Leave application error:', error);
    res.status(500).json({ error: 'Failed to apply leave' });
  }
};

module.exports = { applyLeave };
