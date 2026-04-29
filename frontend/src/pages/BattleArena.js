import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { connectSocket } from "../socket/socket";

const BattleArena = () => {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [match, setMatch] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [status, setStatus] = useState("waiting"); // waiting | in_progress | ended
  const [result, setResult] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQ = questions[currentIdx];
  const calculateRemainingTime = useCallback((startedAt, durationMins) => {
    if (!startedAt) return durationMins * 60;
    const start = new Date(startedAt).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - start) / 1000);
    const totalSeconds = durationMins * 60;
    const remaining = totalSeconds - elapsedSeconds;
    return remaining > 0 ? remaining : 0;
  }, []);

  // Setup socket
  useEffect(() => {
    socketRef.current = connectSocket(user._id);
    const socket = socketRef.current;

    socket.emit("join_battle", { matchId, userId: user._id, userName: user.name });

    socket.on("player_joined", ({ userName }) => {
      console.log(`${userName} joined the battle`);
    });

    socket.on("battle_started", ({ questions: qs, duration, startTime }) => {
      setQuestions(qs);
      const remaining = calculateRemainingTime(startTime || Date.now(), duration);
      setTimeLeft(remaining);
      setStatus("in_progress");
      setQuestionStartTime(Date.now());
    });

    socket.on("leaderboard_update", ({ leaderboard: lb }) => {
      setLeaderboard(lb);
    });

    socket.on("answer_result", ({ isCorrect, score: s, totalScore }) => {
      setScore(totalScore);
      setResult({ isCorrect, awarded: s });
    });

    socket.on("battle_ended", ({ winnerId, finalScores, leaderboard: lb }) => {
      setStatus("ended");
      setLeaderboard(lb);
    });

    return () => {
      socket.off("battle_started");
      socket.off("leaderboard_update");
      socket.off("answer_result");
      socket.off("battle_ended");
      socket.off("player_joined");
    };
  }, [matchId, user]);

  // Load match info
  useEffect(() => {
    axios.get(`/api/battle/${matchId}`).then((r) => {
      const m = r.data.match;
      setMatch(m);
      if (m.status === "IN_PROGRESS") {
        setQuestions(m.questions || []);
        setStatus("in_progress");
        const remaining = calculateRemainingTime(m.startedAt, m.duration);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          setStatus("ended");
        }
      }
    });
  }, [matchId, calculateRemainingTime]);

  // Timer countdown
  useEffect(() => {
    if (status !== "in_progress" || timeLeft <= 0) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleEndBattle();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [status, timeLeft]);

  const handleStartBattle = () => {
    socketRef.current.emit("start_battle", { matchId });
  };

  const handleSubmitAnswer = useCallback(() => {
    if (submitted || selectedAnswer === null) return;
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    socketRef.current.emit("submit_answer", {
      matchId,
      userId: user._id,
      userName: user.name,
      questionId: currentQ._id,
      answer: selectedAnswer,
      timeTaken,
    });
    setSubmitted(true);
  }, [submitted, selectedAnswer, currentQ, matchId, user, questionStartTime]);

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
      setResult(null);
      setQuestionStartTime(Date.now());
    } else {
      handleEndBattle();
    }
  };

  const handleEndBattle = () => {
    socketRef.current.emit("end_battle", { matchId });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const sec = (secs % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // --- ENDED STATE ---
  if (status === "ended") {
    const myEntry = leaderboard.find((e) => e.userId === user._id);
    const won = leaderboard[0]?.userId === user._id;
    return (
      <div style={st.page}>
        <div style={st.resultCard}>
          <div style={{ fontSize: "14px", color: won ? "#10b981" : "#a1a1aa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
            {won ? "Victory" : "Battle Over"}
          </div>
          <h2 style={{ color: won ? "#10b981" : "#fafafa", marginBottom: "4px", fontSize: "24px", fontWeight: 700 }}>
            {won ? "You Won!" : "Good Fight!"}
          </h2>
          <div style={st.finalScore}>{score} pts</div>
          <div style={{ color: "#71717a", marginBottom: "28px", fontSize: "13px" }}>Rank #{myEntry?.rank || "--"} in this battle</div>

          <div style={{ textAlign: "left", width: "100%" }}>
            <h3 style={{ color: "#a1a1aa", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Leaderboard</h3>
            {leaderboard.map((p) => (
              <div key={p.userId} style={{ ...st.lbRow, background: p.userId === user._id ? "rgba(124, 58, 237, 0.08)" : "transparent" }}>
                <span style={st.lbRank}>#{p.rank}</span>
                <span style={st.lbName}>{p.userName}</span>
                <span style={{ color: "#7c3aed", fontWeight: 600, fontSize: "14px" }}>{p.totalScore}</span>
              </div>
            ))}
          </div>
          <button style={st.primaryBtn} id="back-to-dashboard" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  // --- WAITING STATE ---
  if (status === "waiting") {
    return (
      <div style={st.page}>
        <div style={st.waitCard}>
          <div style={st.waitingDot} />
          <h2 style={{ color: "#fafafa", fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Waiting for opponent</h2>
          <p style={{ color: "#71717a", fontSize: "13px", marginBottom: "4px" }}>
            Match ID: <code style={{ color: "#7c3aed", background: "#1e1e24", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>{matchId}</code>
          </p>
          <p style={{ color: "#52525b", fontSize: "12px", marginBottom: "24px" }}>Share this ID or click Start</p>
          <button style={st.primaryBtn} id="start-battle" onClick={handleStartBattle}>Start Battle</button>
          <button style={st.secondaryBtn} id="cancel-battle" onClick={() => navigate("/dashboard")}>Cancel</button>
        </div>
      </div>
    );
  }

  // --- IN PROGRESS STATE ---
  return (
    <div style={st.page}>
      <div style={st.arena}>
        {/* Question panel */}
        <div style={st.questionPanel}>
          <div style={st.questionHeader}>
            <span style={st.qCounter}>Q{currentIdx + 1}/{questions.length}</span>
            <span style={st.subject}>{currentQ?.subject} / {currentQ?.topic}</span>
            <span style={{ ...st.timer, color: timeLeft < 60 ? "#ef4444" : "#10b981" }}>{formatTime(timeLeft)}</span>
          </div>

          <div style={st.questionText}>{currentQ?.content}</div>

          {currentQ?.type === "MCQ" && (
            <div style={st.options}>
              {currentQ.options.map((opt, i) => {
                let borderColor = "#27272a";
                let bg = "transparent";
                if (submitted) {
                  if (i === currentQ.correctOption) { borderColor = "#10b981"; bg = "rgba(16, 185, 129, 0.06)"; }
                  else if (i === selectedAnswer) { borderColor = "#ef4444"; bg = "rgba(239, 68, 68, 0.06)"; }
                } else if (selectedAnswer === i) {
                  borderColor = "#7c3aed"; bg = "rgba(124, 58, 237, 0.06)";
                }
                return (
                  <button
                    key={i}
                    style={{ ...st.optBtn, borderColor, background: bg }}
                    onClick={() => !submitted && setSelectedAnswer(i)}
                  >
                    <span style={st.optLabel}>{String.fromCharCode(65 + i)}.</span> {opt}
                  </button>
                );
              })}
            </div>
          )}

          {currentQ?.type === "INTEGER" && (
            <input
              style={st.intInput}
              type="number"
              id="integer-answer"
              placeholder="Enter integer answer"
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={submitted}
            />
          )}

          {result && (
            <div style={{
              ...st.resultBanner,
              background: result.isCorrect ? "rgba(16, 185, 129, 0.06)" : "rgba(239, 68, 68, 0.06)",
              borderColor: result.isCorrect ? "#10b981" : "#ef4444",
              color: result.isCorrect ? "#10b981" : "#ef4444",
            }}>
              {result.isCorrect ? "Correct" : "Incorrect"} &middot; {result.awarded > 0 ? "+" : ""}{result.awarded} pts
            </div>
          )}

          <div style={st.btnRow}>
            {!submitted ? (
              <button
                style={{ ...st.actionBtn, opacity: selectedAnswer === null ? 0.4 : 1, cursor: selectedAnswer === null ? "not-allowed" : "pointer" }}
                id="submit-answer"
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            ) : (
              <button style={st.actionBtn} id="next-question" onClick={handleNextQuestion}>
                {currentIdx < questions.length - 1 ? "Next Question" : "End Battle"}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={st.sidebar}>
          <div style={st.scoreBox}>
            <div style={st.myScore}>{score}</div>
            <div style={{ color: "#71717a", fontSize: "12px" }}>Your score</div>
          </div>
          <h3 style={st.lbTitle}>Leaderboard</h3>
          {leaderboard.length === 0 ? (
            <div style={{ color: "#52525b", fontSize: "13px" }}>Waiting for submissions...</div>
          ) : leaderboard.map((p) => (
            <div key={p.userId} style={{ ...st.lbRow, background: p.userId === user._id ? "rgba(124, 58, 237, 0.08)" : "transparent" }}>
              <span style={st.lbRank}>#{p.rank}</span>
              <span style={st.lbName}>{p.userName}</span>
              <span style={{ color: "#7c3aed", fontWeight: 600, fontSize: "13px" }}>{p.totalScore}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const st = {
  page: {
    minHeight: "100vh",
    background: "#09090b",
    color: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  arena: {
    display: "grid",
    gridTemplateColumns: "1fr 260px",
    gap: "20px",
    width: "100%",
    maxWidth: "1000px",
    alignItems: "start",
  },
  questionPanel: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "10px",
    padding: "28px",
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  qCounter: {
    background: "#1e1e24",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    color: "#a1a1aa",
    fontWeight: 600,
  },
  subject: {
    color: "#71717a",
    fontSize: "12px",
  },
  timer: {
    fontSize: "16px",
    fontWeight: "700",
    fontVariantNumeric: "tabular-nums",
  },
  questionText: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#e4e4e7",
    marginBottom: "24px",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
  },
  optBtn: {
    background: "transparent",
    border: "1px solid",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#fafafa",
    fontSize: "14px",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s, background 0.15s",
  },
  optLabel: {
    color: "#7c3aed",
    fontWeight: "600",
    marginRight: "6px",
  },
  intInput: {
    width: "100%",
    background: "#09090b",
    border: "1px solid #27272a",
    borderRadius: "8px",
    padding: "12px 14px",
    color: "#fafafa",
    fontSize: "14px",
    marginBottom: "20px",
    boxSizing: "border-box",
    outline: "none",
  },
  resultBanner: {
    border: "1px solid",
    borderRadius: "8px",
    padding: "10px 14px",
    marginBottom: "16px",
    fontSize: "13px",
    fontWeight: "600",
  },
  btnRow: {
    display: "flex",
    gap: "10px",
  },
  actionBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 24px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  sidebar: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "10px",
    padding: "22px",
  },
  scoreBox: {
    textAlign: "center",
    marginBottom: "20px",
    padding: "14px",
    background: "#09090b",
    borderRadius: "8px",
    border: "1px solid #1e1e24",
  },
  myScore: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#7c3aed",
    fontVariantNumeric: "tabular-nums",
  },
  lbTitle: {
    color: "#a1a1aa",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "10px",
  },
  lbRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 10px",
    borderRadius: "6px",
    marginBottom: "4px",
  },
  lbRank: {
    color: "#71717a",
    fontSize: "12px",
    width: "24px",
    fontWeight: 600,
  },
  lbName: {
    color: "#fafafa",
    fontSize: "13px",
    flex: 1,
  },
  waitCard: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "12px",
    padding: "44px",
    textAlign: "center",
    maxWidth: "420px",
    width: "100%",
  },
  waitingDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#7c3aed",
    margin: "0 auto 20px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  primaryBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "11px 28px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "block",
    width: "100%",
    transition: "opacity 0.15s",
  },
  secondaryBtn: {
    background: "transparent",
    border: "1px solid #27272a",
    color: "#71717a",
    borderRadius: "8px",
    padding: "10px 28px",
    fontSize: "13px",
    cursor: "pointer",
    marginTop: "10px",
    width: "100%",
    transition: "color 0.15s",
  },
  resultCard: {
    background: "#141418",
    border: "1px solid #27272a",
    borderRadius: "12px",
    padding: "44px",
    textAlign: "center",
    maxWidth: "440px",
    width: "100%",
  },
  finalScore: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#7c3aed",
    marginBottom: "4px",
    fontVariantNumeric: "tabular-nums",
  },
};

export default BattleArena;
