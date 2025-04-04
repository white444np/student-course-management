import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.heading}>
            <span style={styles.courseIcon}>📚</span> {course.name}
          </h1>
          <p style={styles.subHeading}>{course.description}</p>
          <div style={styles.metaContainer}>
            <span style={styles.enrollmentBadge}>
              🎓 {students.length}{" "}
              {students.length === 1 ? "Student" : "Students"} Enrolled
            </span>
          </div>
        </div>
      </div>

      <div style={styles.actionsContainer}>
        <button
          onClick={() => navigate("/courses")}
          style={styles.secondaryButton}
        >
          ← Back to All Courses
        </button>
      </div>

      {students.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIllustration}>👩‍🎓</div>
          <h3 style={styles.emptyHeading}>No Students Enrolled</h3>
          <p style={styles.emptyText}>
            This course doesn't have any enrolled students yet
          </p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {students.map((student) => (
            <div key={student._id} style={styles.card}>
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
                <button
                  onClick={() => handleRemoveStudent(student._id)}
                  style={styles.dangerButton}
                  disabled={removingStudent === student._id}
                >
                  {removingStudent === student._id ? (
                    <span style={styles.buttonLoading}>Processing...</span>
                  ) : (
                    "Remove from Course"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Professional, modern styling
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    padding: "2rem",
    marginBottom: "2rem",
    border: "1px solid #eaeaea",
  },
  headerContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  courseIcon: {
    fontSize: "1.5em",
  },
  subHeading: {
    fontSize: "1.1rem",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "1.5rem",
  },
  metaContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  enrollmentBadge: {
    backgroundColor: "#f0f7ff",
    color: "#1a73e8",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  primaryButton: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#1557b0",
      transform: "translateY(-1px)",
    },
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#1a73e8",
    border: "1px solid #1a73e8",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#f0f7ff",
      transform: "translateY(-1px)",
    },
  },
  dangerButton: {
    backgroundColor: "#fff",
    color: "#d32f2f",
    border: "1px solid #d32f2f",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    width: "100%",
    ":hover": {
      backgroundColor: "#ffebee",
    },
    ":disabled": {
      opacity: "0.7",
      cursor: "not-allowed",
    },
  },
  buttonLoading: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    border: "1px solid #f0f0f0",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    },
  },
  cardContent: {
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#1a73e8",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "600",
    flexShrink: "0",
  },
  studentInfo: {
    flex: "1",
    minWidth: "0",
  },
  studentName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0 0 0.25rem 0",
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  studentEmail: {
    color: "#666",
    fontSize: "0.9rem",
    margin: "0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardActions: {
    padding: "0 1.5rem 1.5rem 1.5rem",
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
    border: "3px solid rgba(26, 115, 232, 0.1)",
    borderTopColor: "#1a73e8",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "3rem 2rem",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #eaeaea",
    maxWidth: "500px",
    margin: "2rem auto",
  },
  emptyIllustration: {
    fontSize: "3rem",
    marginBottom: "1rem",
    opacity: "0.7",
  },
  emptyHeading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "0.5rem",
  },
  emptyText: {
    color: "#666",
    fontSize: "1rem",
    marginBottom: "1.5rem",
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    padding: "1rem",
  },
  errorCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "2rem",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid #eaeaea",
    maxWidth: "500px",
  },
  errorHeading: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#d32f2f",
    marginBottom: "1rem",
  },
  errorText: {
    color: "#666",
    fontSize: "1rem",
    marginBottom: "1.5rem",
  },
};

export default CourseStudents;
