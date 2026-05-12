// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { naturalLanguageSearch, keywordSearch } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.post('/natural', naturalLanguageSearch);
router.get('/keyword', keywordSearch);
module.exports = router;