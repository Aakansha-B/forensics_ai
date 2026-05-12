// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  }
});

module.exports = mongoose.model('Message', messageSchema);