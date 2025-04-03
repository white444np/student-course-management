const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", courseSchema, "courses");
// 👆 Explicitly set "courses" collection name

module.exports = Course;
