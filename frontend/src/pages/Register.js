import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", targetExam: "JEE_MAIN" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.targetExam);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>RankED</div>
        <h2 style={styles.title}>Create your account</h2>
        <p style={styles.subtitle}>Join thousands of JEE aspirants competing daily</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { label: "Full Name", name: "name", type: "text", placeholder: "Your name" },
            { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", name: "password", type: "password", placeholder: "Min 6 characters" },
          ].map((f) => (
            <div key={f.name} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                style={styles.input}
                type={f.type}
                name={f.name}
                id={`register-${f.name}`}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                required
              />
            </div>
          ))}
          <div style={styles.field}>
            <label style={styles.label}>Target Exam</label>
            <select
              style={styles.input}
              name="targetExam"
              id="register-targetExam"
              value={form.targetExam}
              onChange={handleChange}
            >
              <option value="JEE_MAIN">JEE Main</option>
              <option value="JEE_ADVANCED">JEE Advanced</option>
            </select>
          </div>
          <button
            style={loading ? { ...styles.btn, opacity: 0.6, cursor: "not-allowed" } : styles.btn}
            type="submit"
            id="register-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p style={styles.footer}>
          Already registered? <Link to="/login" style={styles.link}>Sign in</Link>
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

export default Register;
