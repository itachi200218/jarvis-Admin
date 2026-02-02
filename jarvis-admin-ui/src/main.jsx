import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // 🔥 IMPORTANT (global background)

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <div className="app-root">
            <App />
        </div>
    </React.StrictMode>
);
