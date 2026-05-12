// controllers/analyticsController.js
const Message = require('../models/Message');
const CallLog = require('../models/CallLog');

exports.getAnalytics = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const totalCalls = await CallLog.countDocuments();

    const messagesPerDay = await Message.aggregate([
      {
        $group: {
          _id: { $dayOfMonth: "$timestamp" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalMessages,
      totalCalls,
      messagesPerDay
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};