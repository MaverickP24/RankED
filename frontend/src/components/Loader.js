import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
    <div style={{ width: "40px", height: "40px", border: "3px solid #2a2a4a", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ color: "#888", fontSize: "15px" }}>{text}</span>
  </div>
);

export default Loader;
