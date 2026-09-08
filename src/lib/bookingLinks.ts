export const BOOKING_BASE_URL = "https://restaurantchampselysees-princepalace.fr";

export const getBookingPath = (slug: string) => `/book/${slug}`;

export const getBookingUrl = (slug: string) => `${BOOKING_BASE_URL}${getBookingPath(slug)}`;