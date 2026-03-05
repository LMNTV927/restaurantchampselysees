import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChannelData, ChannelsKPIs } from './useRealtimeChannelsData';

interface ReservationData {
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
}

interface MonthlyData {
  channels: ChannelData[];
  kpis: ChannelsKPIs;
  reservations: ReservationData[];
}

const calculateEvolution = (current: number, previous: number): number | null => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};

const fetchMonthlyData = async (selectedMonth: string): Promise<MonthlyData> => {
  const [year, month] = selectedMonth.split('-');
  const startDate = `${year}-${month}-01`;
  const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
  const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;
  const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
  const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
  const prevStartDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;

  const [channelsRes, statsRes, prevStatsRes, reservationsRes] = await Promise.all([
    supabase.from('channels').select('id, name, slug, description, is_active').eq('is_active', true),
    supabase.from('channel_stats').select('channel_id, clicks, reservations, total_covers, date').gte('date', startDate).lt('date', endDate),
    supabase.from('channel_stats').select('channel_id, clicks, reservations, total_covers, date').gte('date', prevStartDate).lt('date', startDate),
    supabase.from('reservations').select('*, channels(name)').gte('created_at', startDate).lt('created_at', endDate).order('created_at', { ascending: false }),
  ]);

  if (channelsRes.error) throw channelsRes.error;
  if (statsRes.error) throw statsRes.error;
  if (prevStatsRes.error) throw prevStatsRes.error;
  if (reservationsRes.error) throw reservationsRes.error;

  const aggregate = (data: any[]) => {
    const map = new Map();
    data.forEach(stat => {
      const e = map.get(stat.channel_id) || { clicks: 0, reservations: 0, total_covers: 0 };
      map.set(stat.channel_id, {
        clicks: e.clicks + stat.clicks,
        reservations: e.reservations + stat.reservations,
        total_covers: e.total_covers + stat.total_covers
      });
    });
    return map;
  };

  const channelStatsMap = aggregate(statsRes.data || []);
  const prevChannelStatsMap = aggregate(prevStatsRes.data || []);

  const channels: ChannelData[] = channelsRes.data?.map(channel => {
    const stats = channelStatsMap.get(channel.id) || { clicks: 0, reservations: 0, total_covers: 0 };
    const conversion = stats.clicks > 0 ? Math.round((stats.reservations / stats.clicks) * 100) : 0;
    return {
      id: channel.id, name: channel.name, slug: channel.slug,
      description: channel.description, isActive: channel.is_active,
      clicks: stats.clicks, reservations: stats.reservations,
      covers: stats.total_covers, conversion,
      shortUrl: `${window.location.origin}/book/${channel.slug}`
    };
  }) || [];

  const totalClicks = channels.reduce((s, c) => s + c.clicks, 0);
  const totalReservations = channels.reduce((s, c) => s + c.reservations, 0);
  const totalCovers = channels.reduce((s, c) => s + c.covers, 0);
  const conversion = totalClicks > 0 ? Math.round((totalReservations / totalClicks) * 100) : 0;
  const prevTotalClicks = Array.from(prevChannelStatsMap.values()).reduce((s, st) => s + st.clicks, 0);
  const prevTotalReservations = Array.from(prevChannelStatsMap.values()).reduce((s, st) => s + st.reservations, 0);
  const prevTotalCovers = Array.from(prevChannelStatsMap.values()).reduce((s, st) => s + st.total_covers, 0);
  const prevConversion = prevTotalClicks > 0 ? Math.round((prevTotalReservations / prevTotalClicks) * 100) : 0;

  const reservations: ReservationData[] = reservationsRes.data?.map(r => ({
    id: r.id, customer_name: r.customer_name, customer_email: r.customer_email,
    customer_phone: r.customer_phone, reservation_date: r.reservation_date,
    reservation_time: r.reservation_time, guests_count: r.guests_count,
    status: r.status, notes: r.notes, created_at: r.created_at,
    channel_id: r.channel_id, channel_name: (r.channels as any)?.name || 'Canal inconnu'
  })) || [];

  return {
    channels,
    kpis: {
      totalClicks, totalReservations, totalCovers, conversion,
      evolution: {
        clicksEvolution: calculateEvolution(totalClicks, prevTotalClicks),
        reservationsEvolution: calculateEvolution(totalReservations, prevTotalReservations),
        coversEvolution: calculateEvolution(totalCovers, prevTotalCovers),
        conversionEvolution: calculateEvolution(conversion, prevConversion)
      }
    },
    reservations
  };
};

export function useMonthlyData(selectedMonth: string) {
  const { data, isLoading: loading } = useQuery({
    queryKey: ['monthly-data', selectedMonth],
    queryFn: () => fetchMonthlyData(selectedMonth),
    staleTime: 60000,
    enabled: !!selectedMonth,
  });

  return {
    data: data || null,
    loading,
  };
}
