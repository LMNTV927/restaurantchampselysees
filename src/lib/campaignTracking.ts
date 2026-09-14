/**
 * Suivi des campagnes marketing (utm_campaign / utm_source / gclid).
 *
 * Complète le tracking Google Ads existant (gtag + cookie _gcl_aw) sans le
 * remplacer : on mémorise simplement les paramètres d'URL du premier
 * chargement pour qu'ils survivent aux étapes du tunnel de réservation.
 */

const KEYS = {
  campaign: "pp_utm_campaign",
  source: "pp_utm_source",
  gclid: "pp_gclid",
} as const;

const clean = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim().slice(0, 120);
  return trimmed.length > 0 ? trimmed : null;
};

/** À appeler au premier chargement d'une page : capte et mémorise les paramètres. */
export function captureCampaignParams(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const campaign = clean(params.get("utm_campaign"));
    const source = clean(params.get("utm_source"));
    const gclid = clean(
      params.get("gclid") || params.get("gbraid") || params.get("wbraid")
    );

    if (campaign) localStorage.setItem(KEYS.campaign, campaign);
    if (source) localStorage.setItem(KEYS.source, source);
    if (gclid) localStorage.setItem(KEYS.gclid, gclid);
  } catch {
    // localStorage indisponible (navigation privée) : on ignore silencieusement.
  }
}

export interface CampaignAttribution {
  utm_campaign: string | null;
  utm_source: string | null;
  gclid: string | null;
}

/** Valeurs mémorisées, à envoyer avec la réservation finale. */
export function getCampaignAttribution(): CampaignAttribution {
  if (typeof window === "undefined") {
    return { utm_campaign: null, utm_source: null, gclid: null };
  }
  try {
    return {
      utm_campaign: clean(localStorage.getItem(KEYS.campaign)),
      utm_source: clean(localStorage.getItem(KEYS.source)),
      gclid: clean(localStorage.getItem(KEYS.gclid)),
    };
  } catch {
    return { utm_campaign: null, utm_source: null, gclid: null };
  }
}
