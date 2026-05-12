// controllers/contactController.js
const Contact = require('../models/Contact');

// Add Contact
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ caseId: req.params.caseId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};