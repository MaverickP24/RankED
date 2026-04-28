import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SUBJECTS = ["Physics", "Chemistry", "Mathematics"];
const STRATEGIES = [
  { value: "JEE_MAIN", label: "JEE Main (+4 / -1)" },
  { value: "JEE_ADVANCED", label: "JEE Advanced (+3 / -1)" },
  { value: "SPEED_BASED", label: "Speed Based (bonus for fast answers)" },
  { value: "DIFFICULTY_WEIGHTED", label: "Difficulty Weighted" },
];

const CreateBattle = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ mode: state?.mode || "QUICK_BATTLE", subject: "", topic: "", scoringStrategy: "JEE_MAIN" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/battle/create", form);
      navigate(`/battle/${res.data.matchId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create battle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <button style={s.back} onClick={() => navigate("/dashboard")}>← Back</button>
        <h2 style={s.title}>Configure Battle</h2>
        <p style={s.sub}>Mode: <span style={{ color: "#7c3aed" }}>{form.mode.replace("_", " ")}</span></p>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Subject (optional)</label>
            <select style={s.input} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
              <option value="">All Subjects</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Topic (optional)</label>
            <input style={s.input} type="text" placeholder="e.g. Kinematics, Thermodynamics" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Scoring Strategy</label>
            <select style={s.input} value={form.scoringStrategy} onChange={(e) => setForm({ ...form, scoringStrategy: e.target.value })}>
              {STRATEGIES.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
            </select>
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Battle Room ⚡"}
          </button>
        </form>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  card: { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "480px" },
  back: { background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "14px", marginBottom: "20px", padding: 0 },
  title: { color: "#fff", fontSize: "22px", fontWeight: "600", marginBottom: "6px" },
  sub: { color: "#888", fontSize: "14px", marginBottom: "28px" },
  err: { background: "#3d0000", color: "#ff6b6b", padding: "10px 14px", borderRadius: "8px", marginBottom: "18px", fontSize: "14px" },
  field: { marginBottom: "18px" },
  label: { display: "block", color: "#ccc", fontSize: "14px", marginBottom: "6px", fontWeight: "500" },
  input: { width: "100%", background: "#0f0f1a", border: "1px solid #2a2a4a", borderRadius: "8px", padding: "12px 14px", color: "#fff", fontSize: "15px", boxSizing: "border-box" },
  btn: { width: "100%", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", borderRadius: "8px", padding: "13px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "6px" },
};

export default CreateBattle;
