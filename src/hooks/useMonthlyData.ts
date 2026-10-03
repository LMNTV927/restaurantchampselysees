import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChannelData, ChannelsKPIs } from './useRealtimeChannelsData';
import {
  aggregateClicks,
  buildAnalytics,
  buildKPIs,
  getMonthRanges,
  type AnalyticsReservationRow,
} from '@/lib/analyticsAggregation';

export interface ReservationData {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guests_count: number;
  status: string;
  notes: string | null;
  created_at: string;
  channel_id: string;
  channel_name: string;
  source: string | null;
  utm_campaign: string | null;
}

export interface MonthlyData {
  channels: ChannelData[];
  kpis: ChannelsKPIs;
  reservations: ReservationData[];
}

const toAnalyticsRows = (reservations: ReservationData[]): AnalyticsReservationRow[] =>
  reservations.map((r) => ({
    channel_id: r.channel_id,
    channel_name: r.channel_name,
    source: r.source,
    utm_campaign: r.utm_campaign,
    guests_count: r.guests_count,
  }));

const fetchRangeData = async (start: string, end: string, prevStart: string): Promise<MonthlyData> => {
  const [channelsRes, statsRes, prevStatsRes, reservationsRes, prevReservationsRes] = await Promise.all([
    supabase.from('channels').select('id, name, slug, description, is_active').eq('is_active', true),
    supabase.from('channel_stats').select('channel_id, clicks').gte('date', start).lt('date', end),
    supabase.from('channel_stats').select('channel_id, clicks').gte('date', prevStart).lt('date', start),
    supabase.from('reservations').select('*, channels(name)')
      .gte('reservation_date', start).lt('reservation_date', end)
      .eq('is_duplicate', false)
      .neq('status', 'cancelled')
      .order('reservation_date', { ascending: true }),
    supabase.from('reservations').select('channel_id, source, guests_count, channels(name)')
      .gte('reservation_date', prevStart).lt('reservation_date', start)
      .eq('is_duplicate', false)
      .neq('status', 'cancelled'),
  ]);

  if (channelsRes.error) throw channelsRes.error;
  if (statsRes.error) throw statsRes.error;
  if (prevStatsRes.error) throw prevStatsRes.error;
  if (reservationsRes.error) throw reservationsRes.error;
  if (prevReservationsRes.error) throw prevReservationsRes.error;

  const reservations: ReservationData[] = (reservationsRes.data || []).map((r) => ({
    id: r.id, customer_name: r.customer_name, customer_email: r.customer_email,
    customer_phone: r.customer_phone, reservation_date: r.reservation_date,
    reservation_time: r.reservation_time, guests_count: r.guests_count,
    status: r.status, notes: r.notes, created_at: r.created_at,
    channel_id: r.channel_id,
    channel_name: (r.channels as { name: string } | null)?.name || 'Canal inconnu',
    source: r.source,
    utm_campaign: r.utm_campaign,
  }));

  const prevReservations: AnalyticsReservationRow[] = (prevReservationsRes.data || []).map((r) => {
    const row = r as unknown as { channel_id: string | null; source: string | null; utm_campaign: string | null; guests_count: number | null; channels: { name: string } | null };
    return {
      channel_id: row.channel_id,
      channel_name: row.channels?.name ?? null,
      source: row.source,
      utm_campaign: row.utm_campaign,
      guests_count: row.guests_count,
    };
  });

  const channelRows = channelsRes.data || [];
  const current = buildAnalytics(channelRows, aggregateClicks(statsRes.data || []), toAnalyticsRows(reservations));
  const previous = buildAnalytics(channelRows, aggregateClicks(prevStatsRes.data || []), prevReservations);

  return {
    channels: current.channels,
    kpis: buildKPIs(current.totals, previous.totals),
    reservations,
  };
};

export const fetchMonthlyData = (selectedMonth: string): Promise<MonthlyData> => {
  const { start, end, prevStart } = getMonthRanges(selectedMonth);
  return fetchRangeData(start, end, prevStart);
};

export type ReportPeriod = 'month' | 'quarter' | 'semester' | 'year';

export const periodMonthCount = (period: ReportPeriod): number =>
  period === 'quarter' ? 3 : period === 'semester' ? 6 : 12;

const fmtMonthStart = (d: Date): string =>
  `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;

/** Données agrégées sur une période de N mois terminant au mois sélectionné */
export const fetchPeriodData = (selectedMonth: string, period: ReportPeriod): Promise<MonthlyData> => {
  const count = periodMonthCount(period);
  const [year, month] = selectedMonth.split('-').map(Number);
  const start = fmtMonthStart(new Date(Date.UTC(year, month - count, 1)));
  const end = fmtMonthStart(new Date(Date.UTC(year, month, 1)));
  const prevStart = fmtMonthStart(new Date(Date.UTC(year, month - 2 * count, 1)));
  return fetchRangeData(start, end, prevStart);
};

export function usePeriodData(selectedMonth: string, period: ReportPeriod) {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: ['period-data', selectedMonth, period],
    queryFn: () => fetchPeriodData(selectedMonth, period),
    staleTime: 60000,
    enabled: !!selectedMonth && period !== 'month',
  });

  useEffect(() => {
    const sub = supabase
      .channel('period-data-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['period-data'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channel_stats' }, () => {
        queryClient.invalidateQueries({ queryKey: ['period-data'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [queryClient]);

  return {
    data: data || null,
    loading,
  };
}

export function useMonthlyData(selectedMonth: string) {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: ['monthly-data', selectedMonth],
    queryFn: () => fetchMonthlyData(selectedMonth),
    staleTime: 60000,
    enabled: !!selectedMonth,
  });

  useEffect(() => {
    const sub = supabase
      .channel('monthly-data-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['monthly-data'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channel_stats' }, () => {
        queryClient.invalidateQueries({ queryKey: ['monthly-data'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [queryClient]);

  return {
    data: data || null,
    loading,
  };
}
