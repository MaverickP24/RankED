import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>RankED</div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Login to continue your JEE battle journey</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              id="login-email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              id="login-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          <button
            style={loading ? { ...styles.btn, opacity: 0.6, cursor: "not-allowed" } : styles.btn}
            type="submit"
            id="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p style={styles.footer}>
          No account? <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#09090b",
    padding: "24px",
  },
  card: {
    background: "#141418",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #27272a",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#7c3aed",
    marginBottom: "24px",
    letterSpacing: "-0.5px",
  },
  title: {
    color: "#fafafa",
    fontSize: "20px",
    margin: "0 0 4px 0",
    fontWeight: "600",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    color: "#71717a",
    fontSize: "14px",
    margin: "0 0 28px 0",
    lineHeight: "1.4",
  },
  error: {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "13px",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    color: "#a1a1aa",
    fontSize: "13px",
    marginBottom: "6px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    background: "#09090b",
    border: "1px solid #27272a",
    borderRadius: "8px",
    padding: "11px 14px",
    color: "#fafafa",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s",
  },
  btn: {
    width: "100%",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "11px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    transition: "opacity 0.15s",
  },
  footer: {
    textAlign: "center",
    color: "#71717a",
    fontSize: "13px",
    marginTop: "24px",
  },
  link: {
    color: "#7c3aed",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
