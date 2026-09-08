import { SITE } from "@/lib/siteConfig";

export const SITE_URL = "https://restaurantchampselysees-princepalace.fr";
export const SITE_IMAGE = `${SITE_URL}/prince-palace-og.png`;

export const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "76 Avenue des Champs-Élysées",
  addressLocality: "Paris",
  postalCode: "75008",
  addressRegion: "Île-de-France",
  addressCountry: "FR",
} as const;

export const GEO = {
  "@type": "GeoCoordinates",
  latitude: 48.87152,
  longitude: 2.30431,
} as const;

/** Service du soir : 17h00 → 05h00, tous les jours */
export const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "17:00",
    closes: "05:00",
  },
] as const;

export const restaurantSchema = (overrides: Record<string, unknown> = {}) => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${SITE_URL}/#restaurant`,
  name: SITE.name,
  url: SITE_URL,
  image: SITE_IMAGE,
  logo: `${SITE_URL}/favicon.png`,
  telephone: "+33159133268",
  email: SITE.email,
  priceRange: "€€€",
  servesCuisine: "Cuisine méditerranéenne et internationale",
  currenciesAccepted: "EUR",
  menu: SITE.restaurantSite,
  hasMenu: SITE.restaurantSite,
  acceptsReservations: SITE.bookingPath,
  address: POSTAL_ADDRESS,
  geo: GEO,
  areaServed: "Paris",
  openingHoursSpecification: OPENING_HOURS,
  sameAs: [SITE.instagram, SITE.facebook, SITE.tiktok, SITE.restaurantSite],
  ...overrides,
});

export const eventVenueSchema = (overrides: Record<string, unknown> = {}) => ({
  "@context": "https://schema.org",
  "@type": "EventVenue",
  "@id": `${SITE_URL}/evenementiel#venue`,
  name: "Prince Palace — Espace événementiel Champs-Élysées",
  url: `${SITE_URL}/evenementiel`,
  image: SITE_IMAGE,
  telephone: "+33159133268",
  maximumAttendeeCapacity: SITE.capacity,
  address: POSTAL_ADDRESS,
  geo: GEO,
  openingHoursSpecification: OPENING_HOURS,
  sameAs: [SITE.instagram, SITE.facebook, SITE.tiktok],
  ...overrides,
});
