const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express App
const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

// Use Routes
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);

// ✅ Improved MongoDB Connection with More Stability
mongoose
  .connect(
    "mongodb+srv://np:np@studentmanagement.ha0mgdz.mongodb.net/?retryWrites=true&w=majority&appName=StudentManagement",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Sample Route to Check API Status
app.get("/", (req, res) => {
  res.json({ message: "🚀 Student Course Management System API is Running!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
