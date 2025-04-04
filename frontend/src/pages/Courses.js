import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setIsLoading(true);
    fetch("http://localhost:5000/courses")
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setIsLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(e);
    } else {
      addCourse(e);
    }
  };

  const addCourse = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/courses/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.course) {
          setCourses([...courses, data.course]);
          setName("");
          setDescription("");
        }
      })
      .catch((error) => console.error("Error adding course:", error));
  };

  const updateCourse = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/courses/update/${editingCourse._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.course) {
          setCourses(
            courses.map((c) => (c._id === editingCourse._id ? data.course : c))
          );
          setEditingCourse(null);
          setName("");
          setDescription("");
        }
      })
      .catch((error) => console.error("Error updating course:", error));
  };

  const deleteCourse = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      fetch(`http://localhost:5000/courses/delete/${id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then(() => {
          setCourses(courses.filter((c) => c._id !== id));
        })
        .catch((error) => console.error("Error deleting course:", error));
    }
  };

  const startEditing = (course) => {
    setEditingCourse(course);
    setName(course.name);
    setDescription(course.description);
  };

  const cancelEditing = () => {
    setEditingCourse(null);
    setName("");
    setDescription("");
  };

  const handleViewStudents = (courseId) => {
    navigate(`/course-students/${courseId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>📚 Course Management</h2>
        <p style={styles.subHeading}>Create and manage academic courses</p>
      </div>

      {/* Course Form */}
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Course Name</label>
            <input
              type="text"
              placeholder="Advanced React Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Course objectives and topics covered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              rows="3"
            />
          </div>
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={editingCourse ? styles.updateButton : styles.addButton}
            >
              {editingCourse ? "✏️ Update Course" : "➕ Add Course"}
            </button>
            {editingCourse && (
              <button
                type="button"
                onClick={cancelEditing}
                style={styles.cancelButton}
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Course List */}
      {isLoading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No courses found</p>
          <p style={styles.emptySubText}>Add a course to get started</p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {courses.map((course) => (
            <div key={course._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.courseName}>{course.name}</h3>
                <div style={styles.enrollmentBadge}>
                  🎓 {course.studentsEnrolled?.length || 0} enrolled
                </div>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.courseDescription}>{course.description}</p>
                <button
                  onClick={() => handleViewStudents(course._id)}
                  style={styles.viewButton}
                >
                  View enrolled students →
                </button>
              </div>
              <div style={styles.cardFooter}>
                <button
                  onClick={() => startEditing(course)}
                  style={styles.editButton}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteCourse(course._id)}
                  style={styles.deleteButton}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Modern, professional styling
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "2.25rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  },
  subHeading: {
    fontSize: "1.1rem",
    color: "#7f8c8d",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#2c3e50",
  },
  input: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    transition: "all 0.2s ease",
    outline: "none",
    ":focus": {
      borderColor: "#3498db",
      boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.1)",
    },
  },
  textarea: {
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    transition: "all 0.2s ease",
    outline: "none",
    resize: "vertical",
    minHeight: "80px",
    ":focus": {
      borderColor: "#3498db",
      boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.1)",
    },
  },
  buttonGroup: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "0.5rem",
  },
  addButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#27ae60",
      transform: "translateY(-1px)",
    },
  },
  updateButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#2980b9",
      transform: "translateY(-1px)",
    },
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    ":hover": {
      backgroundColor: "#c0392b",
      transform: "translateY(-1px)",
    },
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    },
  },
  cardHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0",
    color: "#2c3e50",
  },
  enrollmentBadge: {
    backgroundColor: "#f1c40f",
    color: "white",
    padding: "0.25rem 0.5rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  cardBody: {
    padding: "1.25rem 1.5rem",
    flexGrow: 1,
  },
  courseDescription: {
    color: "#7f8c8d",
    lineHeight: "1.6",
    marginBottom: "1rem",
  },
  viewButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "0.9rem",
    cursor: "pointer",
    padding: "0",
    transition: "all 0.2s ease",
    textAlign: "left",
    ":hover": {
      textDecoration: "underline",
    },
  },
  cardFooter: {
    padding: "1rem 1.5rem",
    borderTop: "1px solid #eee",
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
  },
  editButton: {
    backgroundColor: "#f39c12",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    ":hover": {
      backgroundColor: "#d35400",
    },
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    ":hover": {
      backgroundColor: "#c0392b",
    },
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  spinner: {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderLeftColor: "#3498db",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
  emptyState: {
    backgroundColor: "white",
    padding: "3rem 2rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  emptyText: {
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#7f8c8d",
    marginBottom: "0.5rem",
  },
  emptySubText: {
    fontSize: "1rem",
    color: "#bdc3c7",
  },
};

export default Courses;
