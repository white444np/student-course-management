import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>🎓 Student Course Management System</h1>
          <p style={styles.subtitle}>
            A comprehensive platform to manage students, courses, and academic
            progress
          </p>
          <div style={styles.buttonGroup}>
            <Link to="/students" style={styles.link}>
              <button style={styles.primaryButton}>
                <span style={styles.buttonIcon}>📖</span> Manage Students
              </button>
            </Link>
            <Link to="/courses" style={styles.link}>
              <button style={styles.secondaryButton}>
                <span style={styles.buttonIcon}>📚</span> Manage Courses
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div style={styles.features}>
        <h2 style={styles.featuresTitle}>Key Features</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👥</div>
            <h3 style={styles.featureTitle}>Student Management</h3>
            <p style={styles.featureText}>
              Easily add, edit, and track student information and academic
              records
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📝</div>
            <h3 style={styles.featureTitle}>Course Administration</h3>
            <p style={styles.featureText}>
              Manage course offerings, schedules, and enrollment with ease
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Progress Tracking</h3>
            <p style={styles.featureText}>
              Monitor student progress and performance across all courses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern, professional styling
const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#2c3e50",
  },
  hero: {
    backgroundColor: "#3498db",
    background: "linear-gradient(135deg, #3498db 0%, #2c3e50 100%)",
    padding: "5rem 2rem",
    textAlign: "center",
    color: "white",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "1.25rem",
    fontWeight: "300",
    marginBottom: "2.5rem",
    opacity: "0.9",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  link: {
    textDecoration: "none",
  },
  primaryButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "0.75rem 1.75rem",
    fontSize: "1.1rem",
    borderRadius: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    ":hover": {
      backgroundColor: "#27ae60",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    },
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "white",
    border: "2px solid white",
    padding: "0.75rem 1.75rem",
    fontSize: "1.1rem",
    borderRadius: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transform: "translateY(-2px)",
    },
  },
  buttonIcon: {
    fontSize: "1.2rem",
  },
  features: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "4rem 2rem",
  },
  featuresTitle: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "3rem",
    color: "#2c3e50",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "2rem",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
    textAlign: "center",
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    },
  },
  featureIcon: {
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
  },
  featureTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#3498db",
  },
  featureText: {
    color: "#7f8c8d",
    lineHeight: "1.6",
  },
};

export default Home;
