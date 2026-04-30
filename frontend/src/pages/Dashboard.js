import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SUBJECTS = [
  {
    name: "Physics",
    topics: ["Mechanics", "Electrodynamics", "Optics", "Thermodynamics", "Modern Physics"],
    color: "#3b82f6",
    questions: "450+",
  },
  {
    name: "Chemistry",
    topics: ["Organic", "Inorganic", "Physical Chemistry", "Coordination", "Equilibrium"],
    color: "#10b981",
    questions: "380+",
  },
  {
    name: "Mathematics",
    topics: ["Calculus", "Algebra", "Coordinate Geometry", "Trigonometry", "Probability"],
    color: "#f59e0b",
    questions: "420+",
  },
];

const MOCK_TESTS = [
  { title: "JEE Main Full Test", questions: 90, duration: "180 min", difficulty: "Mixed", strategy: "JEE_MAIN", scoring: "+4 correct, -1 wrong" },
  { title: "JEE Advanced Paper", questions: 54, duration: "180 min", difficulty: "Hard", strategy: "JEE_ADVANCED", scoring: "+3 correct, -1 wrong" },
  { title: "Speed Round", questions: 15, duration: "10 min", difficulty: "Medium", strategy: "SPEED_BASED", scoring: "Bonus for fast answers" },
  { title: "Difficulty Challenge", questions: 15, duration: "15 min", difficulty: "Hard", strategy: "DIFFICULTY_WEIGHTED", scoring: "Harder questions = more points" },
];

const STATS = [
  { label: "Total Questions", value: "1,250+" },
  { label: "Subjects", value: "3" },
  { label: "Scoring Modes", value: "4" },
  { label: "Battle Modes", value: "2" },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinId.trim()) {
      navigate(`/battle/${joinId.trim()}`);
    }
  };

  const handleQuickBattle = async (subject) => {
    setQuickLoading(true);
    try {
      const payload = { mode: "QUICK_BATTLE" };
      if (subject) payload.subject = subject;
      const res = await axios.post("/api/battle/create", payload);
      navigate(`/battle/${res.data.matchId}`);
    } catch (err) {
      alert("Failed to start battle");
    } finally {
      setQuickLoading(false);
    }
  };

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

          {/* Hero Section */}
          <div style={s.hero}>
            <div>
              <h1 style={s.heroTitle}>Welcome back, {user?.name?.split(" ")[0]}</h1>
              <p style={s.heroSub}>Challenge opponents in real-time JEE battles. Pick a subject, choose your scoring strategy, and compete.</p>
            </div>
            <div style={s.statsRow}>
              {STATS.map((stat) => (
                <div key={stat.label} style={s.statCard}>
                  <div style={s.statValue}>{stat.value}</div>
                  <div style={s.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Battle Modes */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Battle Modes</h2>
            <div style={s.modesGrid}>
              <button
                id="mode-quick_battle"
                style={s.modeCard}
                onClick={() => handleQuickBattle()}
                disabled={quickLoading}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7c3aed"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#27272a"; }}
              >
                <div style={s.modeTop}>
                  <div style={{ ...s.modeIcon, background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed" }}>Q</div>
                  <div>
                    <div style={s.modeLabel}>Quick Battle</div>
                    <div style={s.modeDesc}>Auto-matched, 15 questions, 10 min</div>
                  </div>
                </div>
                <div style={s.modeMeta}>
                  <span style={s.metaTag}>Auto-match</span>
                  <span style={s.metaTag}>JEE Main Scoring</span>
                </div>
              </button>

              <button
                id="mode-private_room"
                style={s.modeCard}
                onClick={() => navigate("/battle/create", { state: { mode: "PRIVATE_ROOM" } })}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#10b981"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#27272a"; }}
              >
                <div style={s.modeTop}>
                  <div style={{ ...s.modeIcon, background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>P</div>
                  <div>
                    <div style={s.modeLabel}>Private Room</div>
                    <div style={s.modeDesc}>Custom config, invite friends</div>
                  </div>
                </div>
                <div style={s.modeMeta}>
                  <span style={s.metaTag}>Choose subject</span>
                  <span style={s.metaTag}>Custom strategy</span>
                </div>
              </button>
            </div>
          </div>

          {/* Subject Quick Start */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Quick Start by Subject</h2>
            <p style={s.sectionSub}>Jump into a Quick Battle filtered by subject</p>
            <div style={s.subjectsGrid}>
              {SUBJECTS.map((subj) => (
                <button
                  key={subj.name}
                  id={`subject-${subj.name.toLowerCase()}`}
                  style={s.subjectCard}
                  onClick={() => handleQuickBattle(subj.name)}
                  disabled={quickLoading}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = subj.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#27272a"; }}
                >
                  <div style={{ ...s.subjectDot, background: subj.color }} />
                  <div style={s.subjectName}>{subj.name}</div>
                  <div style={s.subjectQuestions}>{subj.questions} questions</div>
                  <div style={s.topicList}>
                    {subj.topics.map((t) => (
                      <span key={t} style={s.topicTag}>{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mock Test Formats */}
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Scoring Strategies</h2>
            <p style={s.sectionSub}>Each battle uses one of these exam-pattern scoring systems</p>
            <div style={s.mockGrid}>
              {MOCK_TESTS.map((test) => (
                <div key={test.title} style={s.mockCard}>
                  <div style={s.mockTitle}>{test.title}</div>
                  <div style={s.mockDetails}>
                    <span>{test.questions} Qs</span>
                    <span style={s.mockDivider} />
                    <span>{test.duration}</span>
                    <span style={s.mockDivider} />
                    <span>{test.difficulty}</span>
                  </div>
                  <div style={{ color: "#71717a", fontSize: "11px", marginTop: "6px" }}>{test.scoring}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Private Battle */}
          <div style={s.section}>
            <div style={s.joinSection}>
              <div>
                <h2 style={{ ...s.sectionTitle, marginBottom: "4px" }}>Join a Private Battle</h2>
                <p style={s.sectionSub}>Paste a Match ID shared by a friend</p>
              </div>
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
    position: "sticky",
    top: 0,
    zIndex: 10,
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
  },
  content: {
    padding: "32px 24px 64px",
  },
  mainContainer: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  // Hero
  hero: {
    marginBottom: "36px",
  },
  heroTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#fafafa",
    marginBottom: "6px",
    letterSpacing: "-0.5px",
  },
  heroSub: {
    color: "#71717a",
    fontSize: "14px",
    lineHeight: "1.5",
    maxWidth: "520px",
    marginBottom: "24px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  statCard: {
    background: "#141418",
    border: "1px solid #1e1e24",
    borderRadius: "10px",
    padding: "16px",
    textAlign: "center",
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#7c3aed",
    marginBottom: "2px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#71717a",
  },

  // Sections
  section: {
    marginBottom: "36px",
  },
  sectionTitle: {
    color: "#fafafa",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px",
    letterSpacing: "-0.2px",
  },
  sectionSub: {
    color: "#52525b",
    fontSize: "13px",
    marginBottom: "14px",
  },

  // Battle Modes
  modesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  modeCard: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "10px",
    padding: "20px",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s",
  },
  modeTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "14px",
  },
  modeIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
  },
  modeLabel: {
    color: "#fafafa",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "2px",
  },
  modeDesc: {
    color: "#71717a",
    fontSize: "12px",
  },
  modeMeta: {
    display: "flex",
    gap: "8px",
  },
  metaTag: {
    fontSize: "11px",
    color: "#52525b",
    background: "#1e1e24",
    padding: "3px 8px",
    borderRadius: "4px",
  },

  // Subjects
  subjectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
  },
  subjectCard: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "10px",
    padding: "20px",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s",
  },
  subjectDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    marginBottom: "12px",
  },
  subjectName: {
    color: "#fafafa",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "2px",
  },
  subjectQuestions: {
    color: "#52525b",
    fontSize: "12px",
    marginBottom: "12px",
  },
  topicList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  topicTag: {
    fontSize: "11px",
    color: "#71717a",
    background: "#1e1e24",
    padding: "3px 8px",
    borderRadius: "4px",
  },

  // Mock Tests
  mockGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  mockCard: {
    background: "#141418",
    border: "1px solid #1e1e24",
    borderRadius: "10px",
    padding: "16px 18px",
  },
  mockTitle: {
    color: "#e4e4e7",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  mockDetails: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#52525b",
    fontSize: "12px",
  },
  mockDivider: {
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "#3f3f46",
    display: "inline-block",
  },

  // Join
  joinSection: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "10px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },
  joinForm: {
    display: "flex",
    gap: "10px",
    flex: "1",
    minWidth: "280px",
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
  },
};

export default Dashboard;
