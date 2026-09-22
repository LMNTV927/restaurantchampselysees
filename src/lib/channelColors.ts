// Distinct channel colors for charts, tables, and reservation lists.
// Each channel gets a stable HSL color that is readable on the dark dashboard.

export interface ChannelColor {
  name: string;
  hsl: string; // e.g. "hsl(42 70% 55%)" for inline styles / Recharts
  cssHsl: string; // e.g. "42 70% 55%" for hsl(var(--x)) form if needed
  tailwindBg: string;
  tailwindText: string;
}

const CHANNEL_PALETTE: Record<string, ChannelColor> = {
  "site internet": {
    name: "Site Internet",
    hsl: "hsl(42 70% 55%)",
    cssHsl: "42 70% 55%",
    tailwindBg: "bg-amber-500",
    tailwindText: "text-amber-400",
  },
  ia: {
    name: "IA",
    hsl: "hsl(280 65% 60%)",
    cssHsl: "280 65% 60%",
    tailwindBg: "bg-purple-500",
    tailwindText: "text-purple-400",
  },
  "google ads": {
    name: "Google Ads",
    hsl: "hsl(210 90% 60%)",
    cssHsl: "210 90% 60%",
    tailwindBg: "bg-blue-500",
    tailwindText: "text-blue-400",
  },
  "google ads p max": {
    name: "Google Ads - P-max",
    hsl: "hsl(260 75% 55%)",
    cssHsl: "260 75% 55%",
    tailwindBg: "bg-purple-500",
    tailwindText: "text-purple-400",
  },
  "google ads search": {
    name: "Google Ads - Search",
    hsl: "hsl(190 80% 45%)",
    cssHsl: "190 80% 45%",
    tailwindBg: "bg-cyan-500",
    tailwindText: "text-cyan-400",
  },
  "p max": {
    name: "P-max",
    hsl: "hsl(260 75% 55%)",
    cssHsl: "260 75% 55%",
    tailwindBg: "bg-purple-500",
    tailwindText: "text-purple-400",
  },
  "search": {
    name: "Search",
    hsl: "hsl(190 80% 45%)",
    cssHsl: "190 80% 45%",
    tailwindBg: "bg-cyan-500",
    tailwindText: "text-cyan-400",
  },
  instagram: {
    name: "Instagram",
    hsl: "hsl(320 80% 60%)",
    cssHsl: "320 80% 60%",
    tailwindBg: "bg-pink-500",
    tailwindText: "text-pink-400",
  },
  tiktok: {
    name: "TikTok",
    hsl: "hsl(170 80% 45%)",
    cssHsl: "170 80% 45%",
    tailwindBg: "bg-teal-500",
    tailwindText: "text-teal-400",
  },
  "site lovable": {
    name: "Site Lovable",
    hsl: "hsl(260 70% 65%)",
    cssHsl: "260 70% 65%",
    tailwindBg: "bg-violet-500",
    tailwindText: "text-violet-400",
  },
  telephone: {
    name: "Téléphone",
    hsl: "hsl(25 85% 55%)",
    cssHsl: "25 85% 55%",
    tailwindBg: "bg-orange-500",
    tailwindText: "text-orange-400",
  },
  tel: {
    name: "Téléphone",
    hsl: "hsl(25 85% 55%)",
    cssHsl: "25 85% 55%",
    tailwindBg: "bg-orange-500",
    tailwindText: "text-orange-400",
  },
  "open table": {
    name: "OpenTable",
    hsl: "hsl(160 60% 50%)",
    cssHsl: "160 60% 50%",
    tailwindBg: "bg-emerald-500",
    tailwindText: "text-emerald-400",
  },
  opentable: {
    name: "OpenTable",
    hsl: "hsl(160 60% 50%)",
    cssHsl: "160 60% 50%",
    tailwindBg: "bg-emerald-500",
    tailwindText: "text-emerald-400",
  },
  facebook: {
    name: "Facebook",
    hsl: "hsl(220 70% 60%)",
    cssHsl: "220 70% 60%",
    tailwindBg: "bg-indigo-500",
    tailwindText: "text-indigo-400",
  },
  direct: {
    name: "Direct",
    hsl: "hsl(42 70% 55%)",
    cssHsl: "42 70% 55%",
    tailwindBg: "bg-amber-500",
    tailwindText: "text-amber-400",
  },
};

const FALLBACK_HUES = [35, 200, 150, 300, 15, 245, 110, 55, 185, 270];

function normalizeChannelName(name: string | null | undefined): string {
  return (name || "").toString().toLowerCase().trim().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ");
}

export function getChannelColor(name: string | null | undefined): ChannelColor {
  const normalized = normalizeChannelName(name);
  if (CHANNEL_PALETTE[normalized]) {
    return CHANNEL_PALETTE[normalized];
  }

  // Try partial matches for known aliases
  for (const [key, color] of Object.entries(CHANNEL_PALETTE)) {
    if (normalized.includes(key)) {
      return color;
    }
  }

  // Stable fallback hash color
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = FALLBACK_HUES[Math.abs(hash) % FALLBACK_HUES.length];
  return {
    name: name || "Inconnu",
    hsl: `hsl(${hue} 70% 55%)`,
    cssHsl: `${hue} 70% 55%`,
    tailwindBg: "bg-primary",
    tailwindText: "text-primary",
  };
}

export function getChannelHsl(name: string | null | undefined): string {
  return getChannelColor(name).hsl;
}
