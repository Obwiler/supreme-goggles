import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("找不到根元素 #root，请检查 index.html");
}
ReactDOM.createRoot(rootElement).render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
