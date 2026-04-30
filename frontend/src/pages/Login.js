import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { title: "Real-Time 1v1 Battles", desc: "Compete head-to-head with live scoring" },
  { title: "JEE Main & Advanced", desc: "Physics, Chemistry, Math -- all topics" },
  { title: "4 Scoring Strategies", desc: "JEE Main, Advanced, Speed, Difficulty" },
];

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
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={st.container}>
      <div style={st.left}>
        <div>
          <div style={st.logo}>RankED</div>
          <h1 style={st.heading}>Real-Time JEE Battle Platform</h1>
          <p style={st.desc}>1,250+ questions across Physics, Chemistry, and Mathematics. Challenge opponents and climb the leaderboard.</p>
          <div style={st.features}>
            {FEATURES.map((f) => (
              <div key={f.title} style={st.fItem}>
                <div style={st.fDot} />
                <div>
                  <div style={st.fTitle}>{f.title}</div>
                  <div style={st.fDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ color: "#3f3f46", fontSize: "12px", marginTop: "40px" }}>Built for JEE aspirants</div>
      </div>
      <div style={st.right}>
        <div style={st.card}>
          <h2 style={st.title}>Welcome back</h2>
          <p style={st.sub}>Sign in to your account</p>
          {error && <div style={st.err}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={st.field}>
              <label style={st.label}>Email</label>
              <input style={st.input} type="email" name="email" id="login-email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </div>
            <div style={st.field}>
              <label style={st.label}>Password</label>
              <input style={st.input} type="password" name="password" id="login-password" value={form.password} onChange={handleChange} placeholder="Enter password" required />
            </div>
            <button style={loading ? { ...st.btn, opacity: 0.6 } : st.btn} type="submit" id="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={st.footer}>No account? <Link to="/register" style={st.link}>Create one</Link></p>
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
  features: { display: "flex", flexDirection: "column", gap: "18px" },
  fItem: { display: "flex", gap: "12px", alignItems: "flex-start" },
  fDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#7c3aed", marginTop: "7px", flexShrink: 0 },
  fTitle: { color: "#e4e4e7", fontSize: "14px", fontWeight: "600", marginBottom: "2px" },
  fDesc: { color: "#52525b", fontSize: "13px" },
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

export default Login;
