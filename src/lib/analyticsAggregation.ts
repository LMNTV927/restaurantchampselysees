import type { ChannelData, ChannelsKPIs } from '@/hooks/useRealtimeChannelsData';
import { getBookingUrl } from '@/lib/bookingLinks';

export interface AnalyticsChannelRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
}

export interface AnalyticsReservationRow {
  channel_id: string | null;
  channel_name: string | null;
  source: string | null;
  utm_campaign: string | null;
  guests_count: number | null;
}

export interface ClickStatRow {
  channel_id: string;
  clicks: number | null;
}

export const MANUAL_BUCKET = 'Ajout manuel';

/** Clics agrégés par canal */
export const aggregateClicks = (rows: ClickStatRow[]): Map<string, number> => {
  const map = new Map<string, number>();
  rows.forEach((row) => {
    map.set(row.channel_id, (map.get(row.channel_id) || 0) + (row.clicks || 0));
  });
  return map;
};

/**
 * Nom du "canal" réel d'une réservation :
 * la source saisie manuellement (IA, OpenTable, James...) prime sur le canal de tracking.
 */
export const getReservationBucket = (reservation: AnalyticsReservationRow): string => {
  const source = reservation.source?.trim();
  if (source) return source;
  const channelName = reservation.channel_name?.trim();
  if (channelName) {
    const normalizedChannel = normalizeBucketKey(channelName);
    if (normalizedChannel === 'google ads') {
      const campaign = (reservation.utm_campaign || '').toLowerCase();
      if (campaign.includes('pmax')) return 'Google Ads - P-max';
      if (campaign.includes('search')) return 'Google Ads - Search';
    }
    return channelName;
  }
  return MANUAL_BUCKET;
};

interface Bucket {
  reservations: number;
  covers: number;
}

/** Clé de regroupement insensible à la casse/accents ("OpenTable" == "OPENTABLE") */
export const normalizeBucketKey = (name: string): string =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const aggregateReservations = (
  reservations: AnalyticsReservationRow[]
): Map<string, Bucket & { label: string }> => {
  const map = new Map<string, Bucket & { label: string }>();
  reservations.forEach((reservation) => {
    const label = getReservationBucket(reservation);
    const key = normalizeBucketKey(label);
    const existing = map.get(key) || { reservations: 0, covers: 0, label };
    map.set(key, {
      label: existing.label,
      reservations: existing.reservations + 1,
      covers: existing.covers + (reservation.guests_count || 0),
    });
  });
  return map;
};

export interface AnalyticsResult {
  channels: ChannelData[];
  totals: {
    clicks: number;
    reservations: number;
    covers: number;
    trackedReservations: number;
    conversion: number;
  };
}

/**
 * Construit la répartition par canal à partir des vraies réservations
 * (doublons déjà exclus en amont) + des clics issus des liens de tracking.
 */
export const buildAnalytics = (
  channelRows: AnalyticsChannelRow[],
  clicksMap: Map<string, number>,
  reservations: AnalyticsReservationRow[]
): AnalyticsResult => {
  const buckets = aggregateReservations(reservations);
  const used = new Set<string>();

  const trackedChannels: ChannelData[] = channelRows.map((channel) => {
    const key = normalizeBucketKey(channel.name);
    const bucket = buckets.get(key) || { reservations: 0, covers: 0 };
    used.add(key);
    const clicks = clicksMap.get(channel.id) || 0;
    return {
      id: channel.id,
      name: channel.name,
      slug: channel.slug,
      description: channel.description,
      isActive: channel.is_active,
      clicks,
      reservations: bucket.reservations,
      covers: bucket.covers,
      conversion: clicks > 0 ? Math.min(100, Math.round((bucket.reservations / clicks) * 100)) : 0,
      shortUrl: getBookingUrl(channel.slug),
    };
  });

  const otherChannels: ChannelData[] = Array.from(buckets.entries())
    .filter(([key]) => !used.has(key))
    .map(([key, bucket]) => ({
      id: `source:${key}`,
      name: bucket.label,
      slug: '',
      description: null,
      isActive: true,
      clicks: 0,
      reservations: bucket.reservations,
      covers: bucket.covers,
      conversion: 0,
      shortUrl: '',
    }))
    .sort((a, b) => b.reservations - a.reservations);

  const channels = [...trackedChannels, ...otherChannels];

  const clicks = trackedChannels.reduce((sum, c) => sum + c.clicks, 0);
  const trackedReservations = trackedChannels.reduce((sum, c) => sum + c.reservations, 0);
  const totalReservations = channels.reduce((sum, c) => sum + c.reservations, 0);
  const covers = channels.reduce((sum, c) => sum + c.covers, 0);

  return {
    channels,
    totals: {
      clicks,
      reservations: totalReservations,
      covers,
      trackedReservations,
      conversion: clicks > 0 ? Math.min(100, Math.round((trackedReservations / clicks) * 100)) : 0,
    },
  };
};

export const calculateEvolution = (current: number, previous: number): number | null => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};

export const buildKPIs = (
  current: AnalyticsResult['totals'],
  previous: AnalyticsResult['totals']
): ChannelsKPIs => ({
  totalClicks: current.clicks,
  totalReservations: current.reservations,
  totalCovers: current.covers,
  conversion: current.conversion,
  evolution: {
    clicksEvolution: calculateEvolution(current.clicks, previous.clicks),
    reservationsEvolution: calculateEvolution(current.reservations, previous.reservations),
    coversEvolution: calculateEvolution(current.covers, previous.covers),
    conversionEvolution: calculateEvolution(current.conversion, previous.conversion),
  },
});

/** Bornes du mois (YYYY-MM) et du mois précédent, en dates locales YYYY-MM-DD */
export const getMonthRanges = (selectedMonth: string) => {
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const pad = (n: number) => String(n).padStart(2, '0');
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  return {
    start: `${year}-${pad(month)}-01`,
    end: `${nextYear}-${pad(nextMonth)}-01`,
    prevStart: `${prevYear}-${pad(prevMonth)}-01`,
  };
};
