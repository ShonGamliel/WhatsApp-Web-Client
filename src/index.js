import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";

axios.defaults.headers.common["cookies"] = document.cookie;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
axios.interceptors.response.use((res) => {
  if (res.data.authenticated) {
    var farFutureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10);
    document.cookie = `connect_sid=${res.data.session_id}; expires=` + farFutureDate.toUTCString() + "; path=/";
  }
  if (res.data.logout) {
    document.cookie = "connect_sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  return res;
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
