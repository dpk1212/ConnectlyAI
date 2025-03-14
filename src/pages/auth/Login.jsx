import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { signIn } from "../../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hearts, setHearts] = useState([]);
  const [debugMode, setDebugMode] = useState(false);
  const navigate = useNavigate();

  // Generate random heart positions initially and every 10 seconds
  useEffect(() => {
    generateHearts();
    const interval = setInterval(generateHearts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Function to generate random floating hearts
  const generateHearts = () => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: `heart-${Date.now()}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.1,
    }));
    setHearts(newHearts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // Use Firebase authentication
      await signIn(email, password);
      
      // If successful, navigate to welcome page
      navigate("/welcome");
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle different Firebase error codes
      const errorCode = err?.code;
      switch (errorCode) {
        case 'auth/invalid-email':
          setError("Invalid email address format");
          break;
        case 'auth/user-disabled':
          setError("This account has been disabled");
          break;
        case 'auth/user-not-found':
          setError("No account found with this email");
          break;
        case 'auth/wrong-password':
          setError("Invalid password");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed login attempts. Please try again later");
          break;
        default:
          setError("Failed to sign in. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/authlanding");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #8a2387, #e94057, #f27121)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Close button */}
      <motion.button
        onClick={handleClose}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          zIndex: 100,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <IoMdClose size={32} color="#fff" />
      </motion.button>

      {/* Floating hearts background animation */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          style={{
            position: "absolute",
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            opacity: heart.opacity,
            zIndex: 1,
          }}
          initial={{ y: 0 }}
          animate={{ y: -100 }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
          }}
        >
          <FaHeart
            size={heart.size}
            color="#fff"
            style={{ filter: "blur(1px)" }}
          />
        </motion.div>
      ))}

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "90%",
          maxWidth: "420px",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Heart Icon with heartbeat animation */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.2, 1, 1.15, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatDelay: 1
          }}
          style={{
            marginBottom: "1.5rem",
            color: "#fff",
            filter: "drop-shadow(0 0 8px rgba(255, 100, 130, 0.6))",
          }}
        >
          <FaHeart size={48} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "1.8rem",
            color: "#fff",
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          Welcome Back
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "1rem",
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Sign in to <span style={{ fontWeight: "bold" }}>HeartGlow</span>
        </motion.p>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "rgba(255, 85, 85, 0.3)",
                color: "#fff",
                padding: "0.75rem",
                borderRadius: "6px",
                marginBottom: "1rem",
                width: "100%",
                textAlign: "center",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Email Input */}
          <div style={{ width: "100%" }}>
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ width: "100%" }}>
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            />
          </div>

          {/* Forgot Password */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              width: "100%",
              textAlign: "right",
            }}
          >
            <span
              onClick={() => navigate("/password-reset")}
              style={{
                color: "#fff",
                fontSize: "0.85rem",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Forgot Password?
            </span>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "0.5rem",
              transition: "all 0.2s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backdropFilter: "blur(5px)",
            }}
            disabled={loading}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  borderRadius: "50%",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  borderTopColor: "#fff",
                }}
              />
            ) : (
              "Sign In"
            )}
          </motion.button>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.9)",
              marginTop: "1rem",
              fontSize: "0.9rem",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign Up
            </span>
          </motion.p>
        </form>

        {/* Debug toggle only visible in development */}
        {process.env.NODE_ENV === "development" && (
          <motion.div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              fontSize: "0.7rem",
              color: "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
            }}
            onClick={() => setDebugMode(!debugMode)}
          >
            Debug: {debugMode ? "ON" : "OFF"}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
