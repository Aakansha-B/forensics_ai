// controllers/messageController.js
const Message = require('../models/Message');

// Create Message
exports.createMessage = async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Messages by Case
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ caseId: req.params.caseId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};