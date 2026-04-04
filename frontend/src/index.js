import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Reset browser defaults
const globalStyle = document.createElement("style");
globalStyle.innerHTML = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f1a; }`;
document.head.appendChild(globalStyle);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>);
