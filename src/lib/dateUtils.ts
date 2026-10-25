/**
 * Utility functions for handling dates with Paris timezone
 */

const PARIS_TIMEZONE = 'Europe/Paris';

/**
 * Get current date in Paris timezone formatted as YYYY-MM-DD
 */
export function getTodayInParis(): string {
  const now = new Date();
  return now.toLocaleDateString('sv-SE', { timeZone: PARIS_TIMEZONE });
}

/**
 * Get current time in Paris timezone formatted as HH:MM
 */
export function getCurrentTimeInParis(): string {
  const now = new Date();
  return now.toLocaleTimeString('fr-FR', { 
    timeZone: PARIS_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Get a date N days ago from today in Paris timezone
 */
export function getDaysAgoInParis(daysAgo: number): string {
  const now = new Date();
  const parisTime = new Date(now.toLocaleString('en-US', { timeZone: PARIS_TIMEZONE }));
  parisTime.setDate(parisTime.getDate() - daysAgo);
  return parisTime.toLocaleDateString('sv-SE');
}

/**
 * Get a date N days from today (in the future) in Paris timezone
 */
export function getDaysFromNowInParis(daysAhead: number): string {
  const now = new Date();
  const parisTime = new Date(now.toLocaleString('en-US', { timeZone: PARIS_TIMEZONE }));
  parisTime.setDate(parisTime.getDate() + daysAhead);
  return parisTime.toLocaleDateString('sv-SE');
}

/**
 * Check if a reservation date matches today (regardless of time)
 * This ensures we show all reservations for the current day from midnight to midnight
 */
export function isReservationToday(reservationDate: string): boolean {
  const today = getTodayInParis();
  return reservationDate === today;
}

/**
 * Check if a reservation date/time is in the future (Paris timezone)
 */
export function isReservationInFuture(reservationDate: string, reservationTime: string): boolean {
  const now = new Date();
  const parisNow = new Date(now.toLocaleString('en-US', { timeZone: PARIS_TIMEZONE }));
  
  const reservationDateTime = new Date(`${reservationDate}T${reservationTime}`);
  
  return reservationDateTime > parisNow;
}

/**
 * Format a date for display in French locale with Paris timezone
 */
export function formatDateInParis(date: Date): string {
  return date.toLocaleDateString('fr-FR', { 
    timeZone: PARIS_TIMEZONE,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get current month in YYYY-MM format (Paris timezone)
 */
export function getCurrentMonthInParis(): string {
  return getTodayInParis().slice(0, 7);
}

/**
 * Create a date object from date and time strings in Paris timezone
 */
export function createDateTimeInParis(dateString: string, timeString: string): Date {
  // Combine date and time, then interpret in Paris timezone
  const dateTimeString = `${dateString}T${timeString}`;
  const tempDate = new Date(dateTimeString);
  
  // Create a proper date in Paris timezone
  const parisOffset = tempDate.getTimezoneOffset() + (60 * 1); // Approximation, Paris is UTC+1/+2
  return new Date(tempDate.getTime() + (parisOffset * 60 * 1000));
}

/**
 * Get current year in Paris timezone
 */
export function getCurrentYearInParis(): number {
  const now = new Date();
  const parisTime = new Date(now.toLocaleString('en-US', { timeZone: PARIS_TIMEZONE }));
  return parisTime.getFullYear();
}

/**
 * Get current month name in French (Paris timezone) with first letter capitalized
 */
export function getCurrentMonthNameInParis(): string {
  const now = new Date();
  const monthName = now.toLocaleDateString('fr-FR', { 
    timeZone: PARIS_TIMEZONE,
    month: 'long'
  });
  // Capitalize first letter
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
}

/**
 * Get time ago string using Paris timezone
 */
export function getTimeAgoInParis(dateString: string): string {
  const now = new Date();
  const parisNow = new Date(now.toLocaleString('en-US', { timeZone: PARIS_TIMEZONE }));
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((parisNow.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Il y a moins d'une minute";
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
}