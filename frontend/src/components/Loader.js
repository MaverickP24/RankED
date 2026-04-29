import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div style={{ minHeight: "100vh", background: "#09090b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
    <div style={{ width: "32px", height: "32px", border: "2px solid #27272a", borderTop: "2px solid #7c3aed", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ color: "#71717a", fontSize: "14px" }}>{text}</span>
  </div>
);

export default Loader;
