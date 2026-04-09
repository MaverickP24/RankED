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
        <div style={styles.logo}>⚡ RankED</div>
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
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={styles.footer}>
          No account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f1a", padding: "20px" },
  card: { background: "#1a1a2e", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", border: "1px solid #2a2a4a" },
  logo: { fontSize: "28px", fontWeight: "700", color: "#7c3aed", marginBottom: "8px" },
  title: { color: "#fff", fontSize: "22px", margin: "0 0 6px 0", fontWeight: "600" },
  subtitle: { color: "#888", fontSize: "14px", margin: "0 0 28px 0" },
  error: { background: "#3d0000", color: "#ff6b6b", padding: "10px 14px", borderRadius: "8px", marginBottom: "18px", fontSize: "14px" },
  field: { marginBottom: "18px" },
  label: { display: "block", color: "#ccc", fontSize: "14px", marginBottom: "6px", fontWeight: "500" },
  input: { width: "100%", background: "#0f0f1a", border: "1px solid #2a2a4a", borderRadius: "8px", padding: "12px 14px", color: "#fff", fontSize: "15px", boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", borderRadius: "8px", padding: "13px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "6px" },
  footer: { textAlign: "center", color: "#888", fontSize: "14px", marginTop: "22px" },
  link: { color: "#7c3aed", textDecoration: "none", fontWeight: "600" },
};

export default Login;
