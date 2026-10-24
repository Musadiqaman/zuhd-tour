import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { PageDataProvider } from "./context/PageDataContext";
let initialData = {};
try {
  initialData = JSON.parse(document.getElementById("zuhd-page-data")?.textContent || "{}");
} catch {}
import { LanguageProvider } from "./context/LanguageContext";
import "./styles/site.css";
createRoot(document.getElementById("root")).render(<React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <PageDataProvider data={initialData}><LanguageProvider>
          <App />
        </LanguageProvider></PageDataProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>);
import "./styles/experiences.css";
import './styles/refinements.css';
import './styles/journal.css';
