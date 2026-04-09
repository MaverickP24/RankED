import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const TIER_COLORS = {
  "Grand Master": "#FFD700", Master: "#FF6B6B", Diamond: "#00BFFF",
  Platinum: "#4CAF50", Gold: "#FFC107", Silver: "#9E9E9E",
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState("");

  useEffect(() => {
    // No-op for now as rankings are removed for milestone
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinId.trim()) {
      navigate(`/battle/${joinId.trim()}`);
    }
  };

  const modes = [
    { key: "QUICK_BATTLE", label: "⚡ Quick Battle", desc: "15 questions · 10 mins", color: "#7c3aed" },
    { key: "PRIVATE_ROOM", label: "👥 Private Room", desc: "Invite a friend", color: "#10b981" },
  ];

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <span style={s.navLogo}>⚡ RankED</span>
        <div style={s.navRight}>
          <span style={s.navUser}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={s.content}>

        <div style={s.mainContainer}>
          <div style={s.joinSection}>
            <h2 style={s.sectionTitle}>Join Private Battle</h2>
            <form style={s.joinForm} onSubmit={handleJoin}>
              <input
                style={s.joinInput}
                type="text"
                placeholder="Enter Match ID (e.g. 64a...)"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
              />
              <button style={s.joinBtn} type="submit">Join room ⚡</button>
            </form>
          </div>

          <h2 style={s.sectionTitle}>Select Battle Mode</h2>
          <div style={s.modesGrid}>
            {modes.map((m) => (
              <button
                key={m.key}
                style={{ ...s.modeCard, borderColor: m.color }}
                onClick={async () => {
                  if (m.key === "QUICK_BATTLE") {
                    try {
                      const res = await axios.post("/api/battle/create", { mode: "QUICK_BATTLE" });
                      navigate(`/battle/${res.data.matchId}`);
                    } catch (err) {
                      alert("Failed to join quick battle");
                    }
                  } else {
                    navigate("/battle/create", { state: { mode: m.key } });
                  }
                }}
              >
                <div style={s.modeLabel}>{m.label}</div>
                <div style={s.modeDesc}>{m.desc}</div>
                <div style={{ ...s.modeBadge, background: m.color }}>Join →</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#0f0f1a", color: "#fff" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: "#1a1a2e", borderBottom: "1px solid #2a2a4a" },
  navLogo: { fontSize: "22px", fontWeight: "700", color: "#7c3aed" },
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
  navUser: { color: "#ccc", fontSize: "15px" },
  logoutBtn: { background: "transparent", border: "1px solid #333", color: "#888", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontSize: "14px" },
  content: { padding: "32px" },
  mainContainer: { maxWidth: "800px", margin: "0 auto" },
  sectionTitle: { color: "#fff", fontSize: "18px", fontWeight: "600", marginBottom: "16px" },
  modesGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  modeCard: { background: "#1a1a2e", border: "2px solid", borderRadius: "14px", padding: "22px", cursor: "pointer", textAlign: "left", transition: "transform 0.15s" },
  modeLabel: { color: "#fff", fontSize: "17px", fontWeight: "600", marginBottom: "6px" },
  modeDesc: { color: "#888", fontSize: "13px", marginBottom: "16px" },
  modeBadge: { display: "inline-block", color: "#fff", fontSize: "13px", fontWeight: "600", borderRadius: "20px", padding: "4px 14px" },
  joinSection: { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: "14px", padding: "24px", marginBottom: "32px" },
  joinForm: { display: "flex", gap: "12px" },
  joinInput: { flex: 1, background: "#0f0f1a", border: "1px solid #2a2a4a", borderRadius: "8px", padding: "12px 16px", color: "#fff", fontSize: "15px" },
  joinBtn: { background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#fff", border: "none", borderRadius: "8px", padding: "0 24px", fontWeight: "600", cursor: "pointer" },
};

export default Dashboard;
