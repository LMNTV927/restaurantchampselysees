import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureCampaignParams } from "./lib/campaignTracking";

// Capte utm_campaign / utm_source / gclid dès le premier chargement
captureCampaignParams();

createRoot(document.getElementById("root")!).render(<App />);
