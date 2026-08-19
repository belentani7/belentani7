import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function loadAnalytics() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();

  if (!endpoint || !websiteId) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = `${endpoint.replace(/\/+$/, "")}/umami`;
  script.dataset.websiteId = websiteId;
  script.referrerPolicy = "no-referrer-when-downgrade";
  document.head.appendChild(script);
}

loadAnalytics();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Application root element was not found");
}

createRoot(rootElement).render(<App />);

export { loadAnalytics };
