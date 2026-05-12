// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { getContacts, flagContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/:caseId', getContacts);
router.patch('/:id/flag', flagContact);
module.exports = router;