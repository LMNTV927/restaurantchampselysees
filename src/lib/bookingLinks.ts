export const BOOKING_BASE_URL = "https://xn--rservation-prince-palace-bfc.fr";

export const getBookingPath = (slug: string) => `/book/${slug}`;

export const getBookingUrl = (slug: string) => `${BOOKING_BASE_URL}${getBookingPath(slug)}`;