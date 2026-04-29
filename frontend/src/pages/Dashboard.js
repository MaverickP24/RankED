import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinId.trim()) {
      navigate(`/battle/${joinId.trim()}`);
    }
  };

  const modes = [
    { key: "QUICK_BATTLE", label: "Quick Battle", desc: "15 questions, 10 min timer", color: "#7c3aed" },
    { key: "PRIVATE_ROOM", label: "Private Room", desc: "Create and share with a friend", color: "#10b981" },
  ];

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <span style={s.navLogo}>RankED</span>
        <div style={s.navRight}>
          <span style={s.navUser}>{user?.name}</span>
          <button style={s.logoutBtn} id="logout-btn" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div style={s.content}>
        <div style={s.mainContainer}>
          {/* Join Section */}
          <div style={s.joinSection}>
            <h2 style={s.sectionTitle}>Join a Private Battle</h2>
            <form style={s.joinForm} onSubmit={handleJoin}>
              <input
                style={s.joinInput}
                type="text"
                id="join-match-id"
                placeholder="Paste Match ID here"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
              />
              <button style={s.joinBtn} type="submit" id="join-btn">Join</button>
            </form>
          </div>

          {/* Mode Selection */}
          <h2 style={s.sectionTitle}>Select Battle Mode</h2>
          <div style={s.modesGrid}>
            {modes.map((m) => (
              <button
                key={m.key}
                id={`mode-${m.key.toLowerCase()}`}
                style={s.modeCard}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = m.color;
                  e.currentTarget.style.background = "#1a1a1f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#27272a";
                  e.currentTarget.style.background = "#141418";
                }}
              >
                <div style={s.modeLabel}>{m.label}</div>
                <div style={s.modeDesc}>{m.desc}</div>
                <div style={{ ...s.modeBadge, background: m.color }}>Start</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: "100vh",
    background: "#09090b",
    color: "#fafafa",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    background: "#141418",
    borderBottom: "1px solid #1e1e24",
  },
  navLogo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#7c3aed",
    letterSpacing: "-0.5px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  navUser: {
    color: "#a1a1aa",
    fontSize: "14px",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #27272a",
    color: "#71717a",
    borderRadius: "6px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "color 0.15s",
  },
  content: {
    padding: "32px 24px",
  },
  mainContainer: {
    maxWidth: "720px",
    margin: "0 auto",
  },
  sectionTitle: {
    color: "#fafafa",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "14px",
    letterSpacing: "-0.2px",
  },
  modesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  modeCard: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "10px",
    padding: "22px",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s, background 0.15s",
  },
  modeLabel: {
    color: "#fafafa",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  modeDesc: {
    color: "#71717a",
    fontSize: "13px",
    marginBottom: "16px",
    lineHeight: "1.4",
  },
  modeBadge: {
    display: "inline-block",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    borderRadius: "6px",
    padding: "4px 12px",
  },
  joinSection: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "10px",
    padding: "22px",
    marginBottom: "28px",
  },
  joinForm: {
    display: "flex",
    gap: "10px",
  },
  joinInput: {
    flex: 1,
    background: "#09090b",
    border: "1px solid #27272a",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#fafafa",
    fontSize: "14px",
    outline: "none",
  },
  joinBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0 20px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
};

export default Dashboard;
