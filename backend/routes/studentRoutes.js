const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/Course");

// ✅ Add a new student
router.post("/add", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newStudent = new Student({ name, email, courses: [] });
    await newStudent.save();
    res
      .status(201)
      .json({ message: "Student added successfully!", student: newStudent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate(
      "courses.courseId",
      "name description"
    );
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update student details
router.put("/update/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).populate("courses.courseId", "name description");

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found!" });
    }

    res.status(200).json({
      message: "Student updated successfully!",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a student
router.delete("/delete/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res
      .status(200)
      .json({ message: "Student deleted successfully!", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Enroll student in a course (UPDATED)
router.post("/enroll/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.body;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already enrolled
    const isEnrolled = student.courses.some(
      (c) => c.courseId.toString() === courseId
    );
    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in this course",
      });
    }

    // Add course to student
    student.courses.push({ courseId, progress: 0 });
    await student.save();

    // Add student to course (if you maintain this relationship)
    course.studentsEnrolled.push(studentId);
    await course.save();

    // Populate the course data in the response
    const populatedStudent = await Student.findById(studentId).populate(
      "courses.courseId",
      "name description"
    );

    res.status(200).json({
      success: true,
      message: "Enrollment successful",
      student: populatedStudent,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Error enrolling student",
      error: error.message,
    });
  }
});

// ✅ Update Course Progress
router.put("/progress", async (req, res) => {
  try {
    const { studentId, courseId, progress } = req.body;

    // Validate progress value
    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courseIndex = student.courses.findIndex(
      (c) => c.courseId.toString() === courseId
    );
    if (courseIndex === -1) {
      return res.status(404).json({
        message: "Course not found for this student",
      });
    }

    student.courses[courseIndex].progress = progress;
    await student.save();

    res.json({
      message: "Progress updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating progress",
      error: error.message,
    });
  }
});

module.exports = router;
