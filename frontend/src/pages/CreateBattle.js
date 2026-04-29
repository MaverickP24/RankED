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
        <button style={s.back} onClick={() => navigate("/dashboard")}>Back</button>
        <h2 style={s.title}>Configure Battle</h2>
        <p style={s.sub}>Mode: <span style={{ color: "#7c3aed", fontWeight: 600 }}>{form.mode.replace("_", " ")}</span></p>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Subject (optional)</label>
            <select style={s.input} id="battle-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
              <option value="">All Subjects</option>
              {SUBJECTS.map((subj) => <option key={subj}>{subj}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Topic (optional)</label>
            <input style={s.input} id="battle-topic" type="text" placeholder="e.g. Kinematics, Thermodynamics" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Scoring Strategy</label>
            <select style={s.input} id="battle-strategy" value={form.scoringStrategy} onChange={(e) => setForm({ ...form, scoringStrategy: e.target.value })}>
              {STRATEGIES.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
            </select>
          </div>
          <button
            style={{ ...s.btn, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            type="submit"
            id="create-battle-submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Battle Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: "100vh",
    background: "#09090b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "12px",
    padding: "36px",
    width: "100%",
    maxWidth: "440px",
  },
  back: {
    background: "transparent",
    border: "none",
    color: "#71717a",
    cursor: "pointer",
    fontSize: "13px",
    marginBottom: "20px",
    padding: 0,
  },
  title: {
    color: "#fafafa",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "4px",
    letterSpacing: "-0.3px",
  },
  sub: {
    color: "#71717a",
    fontSize: "14px",
    marginBottom: "24px",
  },
  err: {
    background: "rgba(239, 68, 68, 0.1)",
    color: "#ef4444",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "18px",
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
    marginTop: "8px",
    transition: "opacity 0.15s",
  },
};

export default CreateBattle;
