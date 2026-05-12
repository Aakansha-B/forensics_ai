//backend/models/Case.js
const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
  },
  caseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fileType: {
    type: String,
  },
  data: {
    type: Array, // parsed JSON data
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Case", caseSchema);

