import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";

// Set API base URL for production/development
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5001";

// Reset browser defaults and set global design tokens
const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #09090b;
    color: #fafafa;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ::selection { background: rgba(124, 58, 237, 0.3); }
  input::placeholder, textarea::placeholder { color: #52525b; }
  :focus-visible { outline: 2px solid #7c3aed; outline-offset: 2px; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;
document.head.appendChild(globalStyle);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
