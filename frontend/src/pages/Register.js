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
        <div style={styles.logo}>⚡ RankED</div>
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
              <input style={styles.input} type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} required />
            </div>
          ))}
          <div style={styles.field}>
            <label style={styles.label}>Target Exam</label>
            <select style={styles.input} name="targetExam" value={form.targetExam} onChange={handleChange}>
              <option value="JEE_MAIN">JEE Main</option>
              <option value="JEE_ADVANCED">JEE Advanced</option>
            </select>
          </div>
          <button style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p style={styles.footer}>
          Already registered? <Link to="/login" style={styles.link}>Login</Link>
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

export default Register;
