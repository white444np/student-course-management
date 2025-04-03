const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// ✅ Add a new course
router.post("/add", async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Course name is required" });
    }

    const newCourse = new Course({ name, description });
    await newCourse.save();

    res.json({
      success: true,
      message: "Course added successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Delete a course
router.delete("/delete/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get specific course
router.get("/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
});

// Get students enrolled in a course
router.get("/:courseId/students", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "studentsEnrolled",
      "name email"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course.studentsEnrolled || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// In your courseRoutes.js
router.post("/:courseId/remove-student/:studentId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.studentsEnrolled = course.studentsEnrolled.filter(
      (id) => id.toString() !== req.params.studentId
    );

    await course.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error removing student", error });
  }
});

module.exports = router;
