const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// ================== ROUTES ==================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

const caseRoutes = require("./routes/caseRoutes");
app.use("/api", caseRoutes);

// ================== MONGODB CONNECTION ==================
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB Connection Error ❌:", err.message);
    process.exit(1); // stop server if DB fails
  }
};

// ================== START SERVER ==================
const PORT = process.env.PORT || 10000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
