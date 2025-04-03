const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  courses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      progress: { type: Number, default: 0 }, // Progress percentage
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
