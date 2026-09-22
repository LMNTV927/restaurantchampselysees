import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentMonthInParis } from '@/lib/dateUtils';
import {
  aggregateClicks,
  buildAnalytics,
  buildKPIs,
  getMonthRanges,
  type AnalyticsReservationRow,
} from '@/lib/analyticsAggregation';

export interface ChannelData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  clicks: number;
  reservations: number;
  covers: number;
  conversion: number;
  shortUrl: string;
}

export interface ChannelsKPIs {
  totalClicks: number;
  totalReservations: number;
  totalCovers: number;
  conversion: number;
  evolution?: {
    clicksEvolution: number | null;
    reservationsEvolution: number | null;
    coversEvolution: number | null;
    conversionEvolution: number | null;
  };
}

interface ChannelsResult {
  channels: ChannelData[];
  kpis: ChannelsKPIs;
}

type ReservationQueryRow = {
  channel_id: string | null;
  source: string | null;
  utm_campaign: string | null;
  guests_count: number | null;
  channels: { name: string } | null;
};

const mapReservationRows = (rows: ReservationQueryRow[] | null): AnalyticsReservationRow[] =>
  (rows || []).map((r) => ({
    channel_id: r.channel_id,
    channel_name: r.channels?.name ?? null,
    source: r.source,
    utm_campaign: r.utm_campaign,
    guests_count: r.guests_count,
  }));

const fetchChannelsAndStats = async (): Promise<ChannelsResult> => {
  const currentMonth = getCurrentMonthInParis();
  const { start, end, prevStart } = getMonthRanges(currentMonth);

  const [channelsRes, statsRes, prevStatsRes, reservationsRes, prevReservationsRes] = await Promise.all([
    supabase.from('channels').select('id, name, slug, description, is_active').eq('is_active', true),
    supabase.from('channel_stats').select('channel_id, clicks').gte('date', start).lt('date', end),
    supabase.from('channel_stats').select('channel_id, clicks').gte('date', prevStart).lt('date', start),
    supabase.from('reservations').select('channel_id, source, utm_campaign, guests_count, channels(name)')
      .gte('reservation_date', start).lt('reservation_date', end).eq('is_duplicate', false),
    supabase.from('reservations').select('channel_id, source, guests_count, channels(name)')
      .gte('reservation_date', prevStart).lt('reservation_date', start).eq('is_duplicate', false),
  ]);

  if (channelsRes.error) throw channelsRes.error;
  if (statsRes.error) throw statsRes.error;
  if (prevStatsRes.error) throw prevStatsRes.error;
  if (reservationsRes.error) throw reservationsRes.error;
  if (prevReservationsRes.error) throw prevReservationsRes.error;

  const channelRows = channelsRes.data || [];
  const current = buildAnalytics(
    channelRows,
    aggregateClicks(statsRes.data || []),
    mapReservationRows(reservationsRes.data as unknown as ReservationQueryRow[])
  );
  const previous = buildAnalytics(
    channelRows,
    aggregateClicks(prevStatsRes.data || []),
    mapReservationRows(prevReservationsRes.data as unknown as ReservationQueryRow[])
  );

  return {
    channels: current.channels,
    kpis: buildKPIs(current.totals, previous.totals),
  };
};

export function useRealtimeChannelsData() {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: ['channels'],
    queryFn: fetchChannelsAndStats,
    staleTime: 30000,
    initialData: {
      channels: [],
      kpis: { totalClicks: 0, totalReservations: 0, totalCovers: 0, conversion: 0 }
    },
    initialDataUpdatedAt: 0
  });

  useEffect(() => {
    const sub = supabase
      .channel('channels-all-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, () => {
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channel_stats' }, () => {
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [queryClient]);

  return {
    channels: data!.channels,
    kpis: data!.kpis,
    loading,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['channels'] })
  };
}
