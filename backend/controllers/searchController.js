// controllers/searchController.js
const Message = require('../models/Message');
const Contact = require('../models/Contact');

exports.searchData = async (req, res) => {
  try {
    const { query } = req.query;

    const messages = await Message.find({
      content: { $regex: query, $options: 'i' }
    });

    const contacts = await Contact.find({
      name: { $regex: query, $options: 'i' }
    });

    res.json({
      messages,
      contacts
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};