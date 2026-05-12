// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  }
});

module.exports = mongoose.model('Contact', contactSchema);