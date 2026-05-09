import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentMonthInParis } from '@/lib/dateUtils';
import { getBookingUrl } from '@/lib/bookingLinks';

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

const calculateEvolution = (current: number, previous: number): number | null => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};

interface ChannelsResult {
  channels: ChannelData[];
  kpis: ChannelsKPIs;
}

const fetchChannelsAndStats = async (): Promise<ChannelsResult> => {
  const currentMonth = getCurrentMonthInParis();
  const monthStart = `${currentMonth}-01`;
  const [year, month] = currentMonth.split('-');
  const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
  const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
  const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  const prevStartDate = `${prevMonthStr}-01`;

  const [channelsRes, statsRes, prevStatsRes] = await Promise.all([
    supabase.from('channels').select('id, name, slug, description, is_active').eq('is_active', true),
    supabase.from('channel_stats').select('channel_id, clicks, reservations, total_covers').gte('date', monthStart),
    supabase.from('channel_stats').select('channel_id, clicks, reservations, total_covers').gte('date', prevStartDate).lt('date', monthStart),
  ]);

  if (channelsRes.error) throw channelsRes.error;
  if (statsRes.error) throw statsRes.error;
  if (prevStatsRes.error) throw prevStatsRes.error;

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
      shortUrl: getBookingUrl(channel.slug)
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
    }
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
