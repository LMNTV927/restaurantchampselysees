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

export const GOOGLE_ADS_PMAX_LABEL = 'Google Ads - P-max';
export const GOOGLE_ADS_SEARCH_LABEL = 'Google Ads - Search';

/**
 * Détecte la campagne Google Ads (PMax / Search) depuis `utm_campaign`,
 * quel que soit le canal de tracking d'origine.
 */
export const detectCampaignBucket = (utmCampaign: string | null): string | null => {
  const campaign = (utmCampaign || '').toLowerCase();
  if (!campaign) return null;
  if (
    campaign.includes('pmax') ||
    campaign.includes('p-max') ||
    campaign.includes('p_max') ||
    campaign.includes('performance max') ||
    campaign.includes('performance-max') ||
    campaign.includes('performance_max')
  ) {
    return GOOGLE_ADS_PMAX_LABEL;
  }
  if (campaign.includes('search')) return GOOGLE_ADS_SEARCH_LABEL;
  return null;
};

/**
 * Nom du "canal" réel d'une réservation :
 * une campagne Google Ads identifiée prime, puis la source saisie
 * manuellement (IA, OpenTable, James...), puis le canal de tracking.
 */
export const getReservationBucket = (reservation: AnalyticsReservationRow): string => {
  const campaign = detectCampaignBucket(reservation.utm_campaign);
  if (campaign) return campaign;
  const source = reservation.source?.trim();
  if (source) return source;
  const channelName = reservation.channel_name?.trim();
  if (channelName) return channelName;
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

type AggregatedBucket = Bucket & { label: string; channelCounts: Map<string, number> };

const aggregateReservations = (
  reservations: AnalyticsReservationRow[]
): Map<string, AggregatedBucket> => {
  const map = new Map<string, AggregatedBucket>();
  reservations.forEach((reservation) => {
    const label = getReservationBucket(reservation);
    const key = normalizeBucketKey(label);
    const existing =
      map.get(key) || { reservations: 0, covers: 0, label, channelCounts: new Map<string, number>() };
    if (reservation.channel_id) {
      existing.channelCounts.set(
        reservation.channel_id,
        (existing.channelCounts.get(reservation.channel_id) || 0) + 1
      );
    }
    map.set(key, {
      label: existing.label,
      reservations: existing.reservations + 1,
      covers: existing.covers + (reservation.guests_count || 0),
      channelCounts: existing.channelCounts,
    });
  });
  return map;
};

/** Canal de tracking majoritaire d'un bucket dérivé */
const dominantChannelId = (channelCounts: Map<string, number>): string | null => {
  let best: string | null = null;
  let bestCount = 0;
  channelCounts.forEach((count, id) => {
    if (count > bestCount) {
      best = id;
      bestCount = count;
    }
  });
  return best;
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

  const channelById = new Map(channelRows.map((c) => [c.id, c]));

  const otherChannels: ChannelData[] = Array.from(buckets.entries())
    .filter(([key]) => !used.has(key))
    .map(([key, bucket]) => {
      // Un bucket dérivé (campagne Google Ads, source manuelle) conserve le
      // canal de tracking réel d'où viennent ses réservations : slug + clics.
      const originId = dominantChannelId(bucket.channelCounts);
      const origin = originId ? channelById.get(originId) : undefined;
      const clicks = originId ? clicksMap.get(originId) || 0 : 0;
      return {
        id: `source:${key}`,
        name: bucket.label,
        slug: origin?.slug ?? '',
        description: null,
        isActive: true,
        clicks,
        reservations: bucket.reservations,
        covers: bucket.covers,
        conversion: clicks > 0 ? Math.min(100, Math.round((bucket.reservations / clicks) * 100)) : 0,
        shortUrl: origin ? getBookingUrl(origin.slug) : '',
      };
    })
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
