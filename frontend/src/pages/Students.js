import React, { useEffect, useState } from "react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = () => {
    fetch("http://localhost:5000/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  };

  const fetchCourses = () => {
    fetch("http://localhost:5000/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const addStudent = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/students/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setStudents([...students, data.student]);
        setName("");
        setEmail("");
      })
      .catch((error) => console.error("Error adding student:", error));
  };

  const updateStudent = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/students/update/${editingStudent._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setStudents((prev) =>
          prev.map((s) => (s._id === editingStudent._id ? data.student : s))
        );
        setEditingStudent(null);
        setName("");
        setEmail("");
      })
      .catch((error) => console.error("Error updating student:", error));
  };

  const deleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`http://localhost:5000/students/delete/${id}`, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          setStudents(students.filter((s) => s._id !== id));
          setSelectedCourses((prev) => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
          });
        })
        .catch((error) => console.error("Error deleting student:", error));
    }
  };

  const handleCourseSelect = (studentId, courseId) => {
    setSelectedCourses((prev) => ({
      ...prev,
      [studentId]: courseId,
    }));
  };

  const enrollStudent = async (studentId) => {
    const courseId = selectedCourses[studentId];

    if (!courseId) {
      alert("Please select a course first");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/students/enroll/${studentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to enroll student");
      }

      alert(`Success: ${data.message}`);
      fetchStudents();

      setSelectedCourses((prev) => {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      });
    } catch (error) {
      console.error("Enrollment error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>🎓 Student Management</h2>
        <p style={styles.subHeading}>
          Manage student records and course enrollments
        </p>
      </div>

      <div style={styles.formContainer}>
        <form
          onSubmit={editingStudent ? updateStudent : addStudent}
          style={styles.form}
        >
          <div style={styles.formGroup}>
            <label style={styles.label}>Student Name</label>
            <input
              type="text"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Student Email</label>
            <input
              type="email"
              placeholder="Enter student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={editingStudent ? styles.updateButton : styles.addButton}
            >
              {editingStudent ? "✏️ Update Student" : "➕ Add Student"}
            </button>
            {editingStudent && (
              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null);
                  setName("");
                  setEmail("");
                }}
                style={styles.cancelButton}
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {students.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No students found.</p>
          <p style={styles.emptySubText}>Add a student to get started</p>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {students.map((student) => (
            <div key={student._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.studentName}>{student.name}</h3>
                <p style={styles.studentEmail}>{student.email}</p>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Enrolled Courses</h4>
                  <ul style={styles.courseList}>
                    {student.courses.length > 0 ? (
                      student.courses.map((course) => (
                        <li key={course._id} style={styles.courseItem}>
                          <span style={styles.courseName}>{course.name}</span>
                        </li>
                      ))
                    ) : (
                      <li style={styles.noCourseItem}>No enrolled courses</li>
                    )}
                  </ul>
                </div>

                <div style={styles.section}>
                  <h4 style={styles.sectionTitle}>Enroll in New Course</h4>
                  <div style={styles.enrollSection}>
                    <select
                      onChange={(e) =>
                        handleCourseSelect(student._id, e.target.value)
                      }
                      value={selectedCourses[student._id] || ""}
                      style={styles.dropdown}
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => enrollStudent(student._id)}
                      style={styles.enrollButton}
                      disabled={!selectedCourses[student._id]}
                    >
                      📚 Enroll
                    </button>
                  </div>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <button
                  onClick={() => {
                    setEditingStudent(student);
                    setName(student.name);
                    setEmail(student.email);
                  }}
                  style={styles.editButton}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteStudent(student._id)}
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

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  },
  subHeading: {
    fontSize: "1.1rem",
    color: "#7f8c8d",
    marginBottom: "2rem",
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
    transition: "all 0.2s ease",
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
    transition: "all 0.2s ease",
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
    transition: "all 0.2s ease",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    },
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #eee",
  },
  studentName: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.25rem",
    color: "#2c3e50",
  },
  studentEmail: {
    fontSize: "0.9rem",
    color: "#7f8c8d",
    marginBottom: "0",
  },
  cardBody: {
    padding: "1.25rem 1.5rem",
    flexGrow: 1,
  },
  section: {
    marginBottom: "1.25rem",
  },
  sectionTitle: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  courseList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  courseItem: {
    backgroundColor: "#f8f9fa",
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  noCourseItem: {
    color: "#95a5a6",
    fontStyle: "italic",
    fontSize: "0.9rem",
  },
  enrollSection: {
    display: "flex",
    gap: "0.75rem",
  },
  dropdown: {
    flex: 1,
    padding: "0.5rem 0.75rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "0.9rem",
    outline: "none",
    transition: "all 0.2s ease",
    ":focus": {
      borderColor: "#3498db",
    },
  },
  enrollButton: {
    backgroundColor: "#3498db",
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
      backgroundColor: "#2980b9",
    },
    ":disabled": {
      backgroundColor: "#bdc3c7",
      cursor: "not-allowed",
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

export default Students;
