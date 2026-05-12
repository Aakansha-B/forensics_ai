//backend/routes/caseRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createCase,getCases,getCaseById } = require("../controllers/caseController");


// store uploaded files temporarily
const upload = multer({ dest: "uploads/" });

router.post("/cases", upload.single("file"), createCase);
router.get("/cases", getCases);
router.get("/cases/:id", getCaseById);
module.exports = router;

