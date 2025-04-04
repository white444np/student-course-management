import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import CourseStudents from "./pages/CourseStudents"; // NEW IMPORT

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course-students/:courseId" element={<CourseStudents />} />
      </Routes>
    </Router>
  );
};

export default App;
