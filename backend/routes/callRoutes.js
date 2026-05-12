// routes/callRoutes.js
const express = require('express');
const router = express.Router();
const { getCalls } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.get('/:caseId', getCalls);
module.exports = router;