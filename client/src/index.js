import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./contexts/UserContext";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { HeaderProvider } from "./contexts/HeaderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <HeaderProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </HeaderProvider>
    </Router>
  </React.StrictMode>
);
