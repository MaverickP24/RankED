import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HIGHLIGHTS = [
  { title: "1,250+ Questions", desc: "Physics, Chemistry, Mathematics" },
  { title: "Live Leaderboards", desc: "Real-time rank updates every answer" },
  { title: "Multiple Exam Patterns", desc: "JEE Main, Advanced, Speed rounds" },
];

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
    <div style={st.container}>
      <div style={st.left}>
        <div>
          <div style={st.logo}>RankED</div>
          <h1 style={st.heading}>Start Competing Today</h1>
          <p style={st.desc}>Join thousands of JEE aspirants in real-time battles. Test your speed, accuracy, and knowledge against peers.</p>
          <div style={st.highlights}>
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} style={st.hItem}>
                <div style={st.hDot} />
                <div>
                  <div style={st.hTitle}>{h.title}</div>
                  <div style={st.hDesc}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ color: "#3f3f46", fontSize: "12px", marginTop: "40px" }}>Free to use, no credit card required</div>
      </div>
      <div style={st.right}>
        <div style={st.card}>
          <h2 style={st.title}>Create your account</h2>
          <p style={st.sub}>Takes less than a minute</p>
          {error && <div style={st.err}>{error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { label: "Full Name", name: "name", type: "text", ph: "Your name" },
              { label: "Email", name: "email", type: "email", ph: "you@example.com" },
              { label: "Password", name: "password", type: "password", ph: "Min 6 characters" },
            ].map((f) => (
              <div key={f.name} style={st.field}>
                <label style={st.label}>{f.label}</label>
                <input style={st.input} type={f.type} name={f.name} id={`register-${f.name}`} value={form[f.name]} onChange={handleChange} placeholder={f.ph} required />
              </div>
            ))}
            <div style={st.field}>
              <label style={st.label}>Target Exam</label>
              <select style={st.input} name="targetExam" id="register-targetExam" value={form.targetExam} onChange={handleChange}>
                <option value="JEE_MAIN">JEE Main</option>
                <option value="JEE_ADVANCED">JEE Advanced</option>
              </select>
            </div>
            <button style={loading ? { ...st.btn, opacity: 0.6 } : st.btn} type="submit" id="register-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p style={st.footer}>Already registered? <Link to="/login" style={st.link}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

const st = {
  container: { minHeight: "100vh", display: "flex", background: "#09090b" },
  left: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 44px", borderRight: "1px solid #1e1e24", maxWidth: "520px" },
  logo: { fontSize: "22px", fontWeight: "700", color: "#7c3aed", marginBottom: "32px", letterSpacing: "-0.5px" },
  heading: { fontSize: "28px", fontWeight: "700", color: "#fafafa", lineHeight: "1.25", marginBottom: "12px", letterSpacing: "-0.5px" },
  desc: { color: "#71717a", fontSize: "14px", lineHeight: "1.6", marginBottom: "36px" },
  highlights: { display: "flex", flexDirection: "column", gap: "18px" },
  hItem: { display: "flex", gap: "12px", alignItems: "flex-start" },
  hDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", marginTop: "7px", flexShrink: 0 },
  hTitle: { color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "2px" },
  hDesc: { color: "#52525b", fontSize: "13px" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px" },
  card: { width: "100%", maxWidth: "360px" },
  title: { color: "#fafafa", fontSize: "20px", margin: "0 0 4px", fontWeight: "600" },
  sub: { color: "#71717a", fontSize: "14px", margin: "0 0 28px" },
  err: { background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "10px 14px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", border: "1px solid rgba(239,68,68,0.2)" },
  field: { marginBottom: "16px" },
  label: { display: "block", color: "#a1a1aa", fontSize: "13px", marginBottom: "6px", fontWeight: "500" },
  input: { width: "100%", background: "#141418", border: "1px solid #27272a", borderRadius: "8px", padding: "11px 14px", color: "#fafafa", fontSize: "14px", boxSizing: "border-box", outline: "none" },
  btn: { width: "100%", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginTop: "8px" },
  footer: { textAlign: "center", color: "#71717a", fontSize: "13px", marginTop: "24px" },
  link: { color: "#7c3aed", textDecoration: "none", fontWeight: "600" },
};

export default Register;
