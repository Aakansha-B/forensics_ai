// models/CallLog.js
const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  caller: String,
  receiver: String,
  duration: Number, // seconds
  timestamp: {
    type: Date,
    default: Date.now
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  }
});

module.exports = mongoose.model('CallLog', callLogSchema);