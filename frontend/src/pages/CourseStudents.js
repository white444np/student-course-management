import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CourseStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingStudent, setRemovingStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [courseRes, studentsRes] = await Promise.all([
          fetch(`http://localhost:5000/courses/${courseId}`),
          fetch(`http://localhost:5000/courses/${courseId}/students`),
        ]);

        if (!courseRes.ok) throw new Error("Course not found");
        if (!studentsRes.ok) throw new Error("Failed to load students");

        const [courseData, studentsData] = await Promise.all([
          courseRes.json(),
          studentsRes.json(),
        ]);

        setCourse(courseData);
        setStudents(studentsData);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleRemoveStudent = async (studentId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this student from the course?"
      )
    ) {
      return;
    }

    try {
      setRemovingStudent(studentId);
      const response = await fetch(
        `http://localhost:5000/courses/${courseId}/remove-student/${studentId}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to remove student");

      setStudents(students.filter((student) => student._id !== studentId));
    } catch (err) {
      console.error("Error removing student:", err);
      alert("Failed to remove student: " + err.message);
    } finally {
      setRemovingStudent(null);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading enrolled students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorHeading}>⚠️ Error</h2>
          <p style={styles.errorText}>{error}</p>
          <button
            onClick={() => navigate("/courses")}
            style={styles.primaryButton}
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.headerContent}>
          <h1 style={styles.heading}>
            <span style={styles.courseIcon}>📚</span>
            <motion.span
              style={styles.courseName}
              whileHover={{ color: "#4f46e5" }}
            >
              {course.name}
            </motion.span>
          </h1>
          <p style={styles.subHeading}>{course.description}</p>

          <motion.div
            style={styles.enrollmentBadge}
            whileHover={{ scale: 1.05 }}
          >
            🎓 {students.length}{" "}
            {students.length === 1 ? "Student" : "Students"} Enrolled
          </motion.div>
        </div>
      </motion.div>

      <div style={styles.actionsContainer}>
        <motion.button
          onClick={() => navigate("/courses")}
          style={styles.backButton}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Back to Courses
        </motion.button>
      </div>

      {students.length === 0 ? (
        <motion.div
          style={styles.emptyState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={styles.emptyIllustration}>👩‍🎓</div>
          <h3 style={styles.emptyHeading}>No Students Enrolled</h3>
          <p style={styles.emptyText}>
            This course doesn't have any enrolled students yet
          </p>
        </motion.div>
      ) : (
        <div style={styles.cardGrid}>
          {students.map((student) => (
            <motion.div
              key={student._id}
              style={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div style={styles.cardContent}>
                <div style={styles.avatar}>
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.studentInfo}>
                  <h3 style={styles.studentName}>{student.name}</h3>
                  <p style={styles.studentEmail}>{student.email}</p>
                </div>
              </div>
              <div style={styles.cardActions}>
                <motion.button
                  onClick={() => handleRemoveStudent(student._id)}
                  style={styles.removeButton}
                  disabled={removingStudent === student._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {removingStudent === student._id ? (
                    <span style={styles.buttonLoading}>⏳ Removing...</span>
                  ) : (
                    "Remove from Course"
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    minHeight: "100vh",
  },
  header: {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    borderRadius: "16px",
    padding: "3rem 2rem",
    marginBottom: "2rem",
    color: "white",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)",
    position: "relative",
    overflow: "hidden",
    "::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: "40%",
      background:
        "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
    },
  },
  headerContent: {
    position: "relative",
    zIndex: 1,
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
  },
  courseIcon: {
    fontSize: "2rem",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
  },
  courseName: {
    transition: "color 0.3s ease",
  },
  subHeading: {
    fontSize: "1.2rem",
    opacity: "0.9",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  enrollmentBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(5px)",
    padding: "0.75rem 1.5rem",
    borderRadius: "50px",
    fontSize: "1rem",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "default",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  actionsContainer: {
    marginBottom: "2rem",
  },
  backButton: {
    backgroundColor: "white",
    color: "#4f46e5",
    border: "none",
    padding: "0.85rem 1.75rem",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 15px rgba(79, 70, 229, 0.2)",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    border: "1px solid #f3f4f6",
    transition: "all 0.3s ease",
  },
  cardContent: {
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "600",
    flexShrink: "0",
  },
  studentInfo: {
    flex: "1",
    minWidth: "0",
  },
  studentName: {
    fontSize: "1.2rem",
    fontWeight: "700",
    margin: "0 0 0.25rem 0",
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  studentEmail: {
    color: "#6b7280",
    fontSize: "0.95rem",
    margin: "0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardActions: {
    padding: "0 1.5rem 1.5rem 1.5rem",
  },
  removeButton: {
    backgroundColor: "white",
    color: "#ef4444",
    border: "1px solid #ef4444",
    padding: "0.75rem",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#fef2f2",
    },
    ":disabled": {
      opacity: "0.7",
      cursor: "not-allowed",
      backgroundColor: "#f3f4f6",
    },
  },
  buttonLoading: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "3rem 2rem",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
    maxWidth: "500px",
    margin: "0 auto",
  },
  emptyIllustration: {
    fontSize: "4rem",
    marginBottom: "1.5rem",
    opacity: "0.8",
  },
  emptyHeading: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.75rem",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: "1.1rem",
    marginBottom: "1.5rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
  },
  loadingText: {
    marginTop: "1rem",
    color: "#666",
    fontSize: "1rem",
  },
  spinner: {
    border: "4px solid rgba(79, 70, 229, 0.1)",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    padding: "1rem",
  },
  errorCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid #f3f4f6",
    maxWidth: "500px",
  },
  errorHeading: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#ef4444",
    marginBottom: "1rem",
  },
  errorText: {
    color: "#6b7280",
    fontSize: "1.1rem",
    marginBottom: "1.5rem",
  },
  primaryButton: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "0.85rem 1.75rem",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

export default CourseStudents;
