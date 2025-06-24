const Leave = require('../models/LeaveModel');

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

// PATCH /api/leave/:id/status
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, reliever, rejectionReason } = req.body;

    const updateFields = { status };
    if (status === 'Approved') updateFields.reliever = reliever;
    if (status === 'Rejected') updateFields.rejectionReason = rejectionReason;

    const updatedLeave = await Leave.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedLeave) {
      return res.status(404).json({ error: 'Leave not found' });
    }

    res.json({ message: 'Leave status updated', leave: updatedLeave });
  } catch (error) {
    console.error('Leave status update error:', error);
    res.status(500).json({ error: 'Failed to update leave status' });
  }
};


/// Get monthly leave stats
// GET /api/leave/monthly-stats
const getMonthlyStats = async (req, res) => {
  try {
    const stats = await Leave.aggregate([
      {
        $group: {
          _id: { $month: "$fromDate" },
          total: { $sum: 1 },
          approved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Approved"] }, 1, 0]
            }
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    console.error("Error fetching monthly stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};


module.exports = {
  applyLeave,
  updateLeaveStatus,
  getMonthlyStats, // 👈 make sure this is exported
};



