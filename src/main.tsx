import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureCampaignParams } from "./lib/campaignTracking";

// Après une nouvelle publication, les anciens fichiers JS n'existent plus :
// on recharge la page une seule fois pour récupérer la nouvelle version.
const RELOAD_KEY = "chunk-reload-at";
const reloadOnce = () => {
  const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
  if (Date.now() - last > 10000) {
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    window.location.reload();
  }
};
window.addEventListener("vite:preloadError", (e) => {
  e.preventDefault();
  reloadOnce();
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = String((e.reason && e.reason.message) || e.reason || "");
  if (/Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(msg)) {
    reloadOnce();
  }
});

// Capte utm_campaign / utm_source / gclid dès le premier chargement
captureCampaignParams();

createRoot(document.getElementById("root")!).render(<App />);
