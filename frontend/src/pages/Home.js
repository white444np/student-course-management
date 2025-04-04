import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>🎓 Student Course Management System</h1>
          <p style={styles.subtitle}>
            A next-generation platform to efficiently manage students, courses,
            and academic progress.
          </p>
          <div style={styles.buttonGroup}>
            <Link to="/students" style={styles.link}>
              <button style={{ ...styles.button, ...styles.primaryButton }}>
                <span style={styles.buttonIcon}>📖</span> Manage Students
              </button>
            </Link>
            <Link to="/courses" style={styles.link}>
              <button style={{ ...styles.button, ...styles.secondaryButton }}>
                <span style={styles.buttonIcon}>📚</span> Manage Courses
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.features}>
        <h2 style={styles.featuresTitle}>✨ Key Features</h2>
        <div style={styles.featuresGrid}>
          {featureData.map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const featureData = [
  {
    icon: "👥",
    title: "Student Management",
    text: "Add, edit, and track students efficiently.",
  },
  {
    icon: "📝",
    title: "Course Administration",
    text: "Organize and manage courses with ease.",
  },
  {
    icon: "📊",
    title: "Performance Tracking",
    text: "Monitor academic progress seamlessly.",
  },
];

// 💎 Extreme Premium Styling
const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    color: "#ecf0f1",
    background: "radial-gradient(circle, #141E30 0%, #243B55 100%)",
    paddingBottom: "4rem",
  },
  hero: {
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    padding: "6rem 2rem",
    textAlign: "center",
    color: "white",
    borderBottomLeftRadius: "50% 30px",
    borderBottomRightRadius: "50% 30px",
    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.4)",
  },
  heroContent: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: "800",
    marginBottom: "1rem",
    textShadow: "5px 5px 20px rgba(0, 0, 0, 0.4)",
    animation: "fadeIn 1.5s ease-in-out",
  },
  subtitle: {
    fontSize: "1.5rem",
    fontWeight: "300",
    marginBottom: "2.5rem",
    opacity: "0.9",
    animation: "fadeIn 2s ease-in-out",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  link: {
    textDecoration: "none",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    borderRadius: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    transition: "all 0.4s ease",
    fontWeight: "700",
    border: "3px solid transparent",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
  },
  primaryButton: {
    background: "linear-gradient(135deg, #1d976c, #93f9b9)",
    color: "white",
    borderImage: "linear-gradient(135deg, #1d976c, #93f9b9) 1",
  },
  secondaryButton: {
    background: "linear-gradient(135deg, #f4a261, #e76f51)",
    color: "white",
    borderImage: "linear-gradient(135deg, #f4a261, #e76f51) 1",
  },
  buttonIcon: {
    fontSize: "1.4rem",
  },
  features: {
    maxWidth: "1200px",
    margin: "4rem auto",
    padding: "2rem",
    textAlign: "center",
  },
  featuresTitle: {
    fontSize: "2.8rem",
    fontWeight: "700",
    marginBottom: "3rem",
    color: "white",
    textShadow: "3px 3px 10px rgba(255, 255, 255, 0.3)",
    animation: "slideIn 1.5s ease-in-out",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "2rem",
  },
  featureCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    padding: "2.5rem",
    boxShadow: "0 10px 30px rgba(255, 255, 255, 0.2)",
    transition: "all 0.4s ease",
    textAlign: "center",
    color: "white",
    transform: "scale(1)",
    ":hover": {
      transform: "scale(1.05)",
      boxShadow: "0 15px 40px rgba(255, 255, 255, 0.3)",
    },
  },
  featureIcon: {
    fontSize: "3.5rem",
    marginBottom: "1.5rem",
    color: "#00c6ff",
    textShadow: "0 0 10px rgba(0, 198, 255, 0.5)",
  },
  featureTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "1rem",
  },
  featureText: {
    fontSize: "1.1rem",
    opacity: "0.85",
    lineHeight: "1.7",
  },
};

export default Home;
