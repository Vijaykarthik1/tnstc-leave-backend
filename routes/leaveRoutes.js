const express = require('express');
const router = express.Router();
const Leave = require('../models/LeaveModel'); // ✅ Matches filename exactly
// <-- Import the Leave model

// 1. Apply for leave
router.post('/apply', async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json({ message: 'Leave applied successfully' });
  } catch (error) {
    console.error('Leave application error:', error);
    res.status(500).json({ error: 'Failed to apply leave' });
  }
});

// 2. Get all leave requests (admin)
router.get('/all', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

// 3. Get leave summary for dashboard
router.get('/summary', async (req, res) => {
  try {
    const [total, approved, pending, rejected] = await Promise.all([
      Leave.countDocuments(),
      Leave.countDocuments({ status: 'Approved' }),
      Leave.countDocuments({ status: 'Pending' }),
      Leave.countDocuments({ status: 'Rejected' }),
    ]);

    res.json({ total, approved, pending, rejected });
  } catch (err) {
    console.error('Error getting summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// 4. Get leave requests of a specific user
router.get('/user/:id', async (req, res) => {
  try {
    const userLeaves = await Leave.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(userLeaves);
  } catch (err) {
    console.error('Error getting user leaves:', err);
    res.status(500).json({ error: 'Failed to fetch user leave history' });
  }
});

// 5. Update status and reliever (combined)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, reliever } = req.body;

    console.log('PATCH /status body:', req.body);

    const updatedLeave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),      // set status if available
        ...(reliever && { reliever }),  // set reliever if available
      },
      { new: true }
    );

    if (!updatedLeave) {
      return res.status(404).json({ error: 'Leave not found' });
    }

    res.json({ message: 'Leave updated successfully', updatedLeave });
  } catch (err) {
    console.error('Error updating status/reliever:', err);
    res.status(500).json({ error: 'Failed to update leave request' });
  }
});

// 6. Filter leave by date range for a specific user
router.get('/user/:id/filter', async (req, res) => {
  try {
    const { from, to } = req.query;
    const userId = req.params.id;

    const query = {
      userId,
      fromDate: { $gte: new Date(from) },
      toDate: { $lte: new Date(to) }
    };

    const filteredLeaves = await Leave.find(query).sort({ createdAt: -1 });
    res.json(filteredLeaves);
  } catch (err) {
    console.error('Error filtering leaves:', err);
    res.status(500).json({ error: 'Failed to filter leave history' });
  }
});



module.exports = router;
