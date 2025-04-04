import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // For animations

const Header = () => {
  return (
    <header style={styles.header}>
      <motion.div
        style={styles.navbar}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <motion.h1 style={styles.logo} whileHover={{ scale: 1.05 }}>
          🎓 Student Course Management
        </motion.h1>

        <nav style={styles.navLinks}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/students">Students</NavLink>
          <NavLink to="/courses">Courses</NavLink>
        </nav>
      </motion.div>
    </header>
  );
};

// Reusable NavLink component with animations
const NavLink = ({ to, children }) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
    <Link to={to} style={styles.link}>
      {children}
      <motion.div
        style={styles.linkUnderline}
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
      />
    </Link>
  </motion.div>
);

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem 5%",
    backgroundColor: "#2c3e50",
    background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
    color: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logo: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
    cursor: "pointer",
    textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
  },
  navLinks: {
    display: "flex",
    gap: "2.5rem",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: 500,
    position: "relative",
    padding: "0.5rem 0",
    transition: "all 0.3s ease",
  },
  linkUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "2px",
    backgroundColor: "#fff",
    borderRadius: "2px",
  },
};

export default Header;
