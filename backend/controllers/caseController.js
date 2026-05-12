// //backend/controllers/caseController.js
// const fs = require("fs");
// const csv = require("csv-parser");
// const XLSX = require("xlsx");
// const Case = require("../models/Case");

// const createCase = async (req, res) => {
//   try {
//     const { caseNumber, caseName, description } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ message: "File is required" });
//     }

//     let parsedData = [];
//     const filePath = file.path;

//     // ✅ JSON
//     if (file.mimetype === "application/json") {
//       const raw = fs.readFileSync(filePath, "utf-8");
//       parsedData = JSON.parse(raw);
//       parsedData = Array.isArray(parsedData) ? parsedData : [parsedData];
//     }

//     // ✅ CSV
//     else if (file.mimetype === "text/csv") {
//       parsedData = await new Promise((resolve, reject) => {
//         const results = [];
//         fs.createReadStream(filePath)
//           .pipe(csv())
//           .on("data", (data) => results.push(data))
//           .on("end", () => resolve(results))
//           .on("error", reject);
//       });
//     }

//     // ✅ Excel
//     else if (
//       file.mimetype ===
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     ) {
//       const workbook = XLSX.readFile(filePath);
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       parsedData = XLSX.utils.sheet_to_json(sheet);
//     }

//     else {
//       return res.status(400).json({ message: "Unsupported file type" });
//     }

//     // ✅ Save to MongoDB Atlas
//     const newCase = await Case.create({
//       caseNumber,
//       caseName,
//       description,
//       fileType: file.mimetype,
//       data: parsedData,
//     });

//     // 🧹 delete temp file
//     fs.unlinkSync(filePath);

//     res.json({
//       success: true,
//       message: "Case saved successfully",
//       caseId: newCase._id,
//       preview: parsedData.slice(0, 5),
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error processing file" });
//   }
// };
// const getCases = async (req, res) => {
//   try {
//     const cases = await Case.find().sort({ createdAt: -1 });
//     res.json(cases);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching cases" });
//   }
// };

// const getCaseById = async (req, res) => {
//   try {
//     const caseData = await Case.findById(req.params.id);

//     if (!caseData) {
//       return res.status(404).json({ message: "Case not found" });
//     }

//     res.json(caseData);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching case" });
//   }
// };

// module.exports = { createCase ,getCases ,getCaseById};

const fs = require("fs");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const Case = require("../models/Case");

const createCase = async (req, res) => {
  try {
    const { caseNumber, caseName, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "File is required" });

    let parsedData = [];
    const filePath = file.path;

    // JSON
    if (
      file.mimetype === "application/json" ||
      file.originalname.endsWith(".json")
    ) {
      const raw = fs.readFileSync(filePath, "utf-8");
      parsedData = JSON.parse(raw);
      parsedData = Array.isArray(parsedData) ? parsedData : [parsedData];
    }
    // CSV
    else if (
      file.mimetype === "text/csv" ||
      file.originalname.endsWith(".csv")
    ) {
      parsedData = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (d) => results.push(d))
          .on("end", () => resolve(results))
          .on("error", reject);
      });
    }
    // Excel
    else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.originalname.endsWith(".xlsx")
    ) {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      parsedData = XLSX.utils.sheet_to_json(sheet);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    const newCase = await Case.create({
      caseNumber,
      caseName,
      description,
      fileType: file.mimetype,
      data: parsedData,
    });

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "Case saved successfully",
      caseId: newCase._id,
      preview: parsedData.slice(0, 5),
      totalRows: parsedData.length,
      totalColumns: parsedData[0] ? Object.keys(parsedData[0]).length : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing file" });
  }
};

const getCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cases" });
  }
};

const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    res.json(caseData);
  } catch (err) {
    res.status(500).json({ message: "Error fetching case" });
  }
};

module.exports = { createCase, getCases, getCaseById };
