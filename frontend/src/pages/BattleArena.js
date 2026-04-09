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
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (status === "ended") {
    const myEntry = leaderboard.find((e) => e.userId === user._id);
    const won = leaderboard[0]?.userId === user._id;
    return (
      <div style={s.page}>
        <div style={s.resultCard}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>{won ? "🏆" : "💪"}</div>
          <h2 style={{ color: won ? "#FFD700" : "#fff", marginBottom: "8px" }}>{won ? "You Won!" : "Good Fight!"}</h2>
          <div style={s.finalScore}>Your Score: {score}</div>
          <div style={{ color: "#888", marginBottom: "24px" }}>Rank #{myEntry?.rank || "—"} in this battle</div>
          <h3 style={{ color: "#fff", marginBottom: "12px" }}>Final Leaderboard</h3>
          {leaderboard.map((p) => (
            <div key={p.userId} style={{ ...s.lbRow, background: p.userId === user._id ? "#2a1a4a" : "transparent" }}>
              <span style={s.lbRank}>#{p.rank}</span>
              <span style={s.lbName}>{p.userName}</span>
              <span style={{ color: "#7c3aed", fontWeight: 700 }}>{p.totalScore} pts</span>
            </div>
          ))}
          <button style={s.backBtn} onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (status === "waiting") {
    return (
      <div style={s.page}>
        <div style={s.waitCard}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <h2 style={{ color: "#fff" }}>Waiting for opponent...</h2>
          <p style={{ color: "#888" }}>Match ID: <code style={{ color: "#7c3aed" }}>{matchId}</code></p>
          <p style={{ color: "#888", fontSize: "14px" }}>Share this ID with a friend or click Start to begin</p>
          <button style={s.startBtn} onClick={handleStartBattle}>Start Battle Now</button>
          <button style={s.backBtn2} onClick={() => navigate("/dashboard")}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.arena}>
        {/* Left: Question panel */}
        <div style={s.questionPanel}>
          <div style={s.questionHeader}>
            <span style={s.qCounter}>Q{currentIdx + 1}/{questions.length}</span>
            <span style={s.subject}>{currentQ?.subject} · {currentQ?.topic}</span>
            <span style={{ ...s.timer, color: timeLeft < 60 ? "#ff6b6b" : "#10b981" }}>⏱ {formatTime(timeLeft)}</span>
          </div>

          <div style={s.questionText}>{currentQ?.content}</div>

          {currentQ?.type === "MCQ" && (
            <div style={s.options}>
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  style={{
                    ...s.optBtn,
                    borderColor: submitted
                      ? i === currentQ.correctOption ? "#10b981" : i === selectedAnswer ? "#ff6b6b" : "#2a2a4a"
                      : selectedAnswer === i ? "#7c3aed" : "#2a2a4a",
                    background: submitted
                      ? i === currentQ.correctOption ? "#0a2e1a" : i === selectedAnswer ? "#2e0a0a" : "transparent"
                      : selectedAnswer === i ? "#1a0a3a" : "transparent",
                  }}
                  onClick={() => !submitted && setSelectedAnswer(i)}
                >
                  <span style={s.optLabel}>{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              ))}
            </div>
          )}

          {currentQ?.type === "INTEGER" && (
            <input
              style={s.intInput}
              type="number"
              placeholder="Enter integer answer"
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={submitted}
            />
          )}

          {result && (
            <div style={{ ...s.resultBanner, background: result.isCorrect ? "#0a2e1a" : "#2e0a0a", borderColor: result.isCorrect ? "#10b981" : "#ff6b6b" }}>
              {result.isCorrect ? "✅ Correct!" : "❌ Wrong"} &nbsp;·&nbsp; {result.awarded > 0 ? "+" : ""}{result.awarded} pts
            </div>
          )}

          <div style={s.btnRow}>
            {!submitted ? (
              <button style={{ ...s.actionBtn, opacity: selectedAnswer === null ? 0.5 : 1 }} onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                Submit Answer
              </button>
            ) : (
              <button style={s.actionBtn} onClick={handleNextQuestion}>
                {currentIdx < questions.length - 1 ? "Next Question →" : "End Battle"}
              </button>
            )}
          </div>
        </div>

        {/* Right: Live leaderboard */}
        <div style={s.sidebar}>
          <div style={s.scoreBox}>
            <div style={s.myScore}>{score}</div>
            <div style={{ color: "#888", fontSize: "13px" }}>Your score</div>
          </div>
          <h3 style={s.lbTitle}>Live Leaderboard</h3>
          {leaderboard.length === 0 ? (
            <div style={{ color: "#555", fontSize: "14px" }}>Waiting for submissions...</div>
          ) : leaderboard.map((p) => (
            <div key={p.userId} style={{ ...s.lbRow, background: p.userId === user._id ? "#1a0a3a" : "transparent" }}>
              <span style={s.lbRank}>#{p.rank}</span>
              <span style={s.lbName}>{p.userName}</span>
              <span style={{ color: "#7c3aed", fontWeight: 700 }}>{p.totalScore}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#0f0f1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  arena: { display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", width: "100%", maxWidth: "1100px", alignItems: "start" },
  questionPanel: { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: "16px", padding: "28px" },
  questionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  qCounter: { background: "#2a2a4a", borderRadius: "20px", padding: "4px 12px", fontSize: "13px", color: "#ccc" },
  subject: { color: "#888", fontSize: "13px" },
  timer: { fontSize: "18px", fontWeight: "700" },
  questionText: { fontSize: "17px", lineHeight: "1.6", color: "#f0f0f0", marginBottom: "24px" },
  options: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
  optBtn: { background: "transparent", border: "2px solid", borderRadius: "10px", padding: "14px 18px", color: "#fff", fontSize: "15px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" },
  optLabel: { color: "#7c3aed", fontWeight: "700", marginRight: "8px" },
  intInput: { width: "100%", background: "#0f0f1a", border: "2px solid #2a2a4a", borderRadius: "10px", padding: "14px", color: "#fff", fontSize: "16px", marginBottom: "20px", boxSizing: "border-box" },
  resultBanner: { border: "1px solid", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "15px", fontWeight: "600" },
  btnRow: { display: "flex", gap: "12px" },
  actionBtn: { background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", borderRadius: "10px", padding: "13px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
  sidebar: { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: "16px", padding: "24px" },
  scoreBox: { textAlign: "center", marginBottom: "24px", padding: "16px", background: "#0f0f1a", borderRadius: "12px" },
  myScore: { fontSize: "42px", fontWeight: "700", color: "#7c3aed" },
  lbTitle: { color: "#fff", fontSize: "15px", fontWeight: "600", marginBottom: "12px" },
  lbRow: { display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", marginBottom: "6px" },
  lbRank: { color: "#888", fontSize: "13px", width: "24px" },
  lbName: { color: "#fff", fontSize: "14px", flex: 1 },
  waitCard: { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: "16px", padding: "48px", textAlign: "center", maxWidth: "480px" },
  startBtn: { background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", borderRadius: "10px", padding: "13px 32px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "24px", display: "block", width: "100%" },
  backBtn2: { background: "transparent", border: "1px solid #333", color: "#888", borderRadius: "10px", padding: "10px 32px", fontSize: "14px", cursor: "pointer", marginTop: "12px", width: "100%" },
  resultCard: { background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: "16px", padding: "48px", textAlign: "center", maxWidth: "480px", width: "100%" },
  finalScore: { fontSize: "32px", fontWeight: "700", color: "#7c3aed", marginBottom: "8px" },
  backBtn: { background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "15px", cursor: "pointer", marginTop: "24px" },
};

export default BattleArena;
