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