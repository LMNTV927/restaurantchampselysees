import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentMonthInParis } from '@/lib/dateUtils';

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

export function useRealtimeChannelsData() {
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [kpis, setKpis] = useState<ChannelsKPIs>({
    totalClicks: 0,
    totalReservations: 0,
    totalCovers: 0,
    conversion: 0
  });
  const [loading, setLoading] = useState(true);

  const calculateEvolution = (current: number, previous: number): number | null => {
    if (previous === 0) return current > 0 ? 100 : null;
    return ((current - previous) / previous) * 100;
  };

  const fetchChannelsAndStats = async () => {
    try {
      // Fetch channels with their stats
      const { data: channelsData, error: channelsError } = await supabase
        .from('channels')
        .select(`
          id,
          name,
          slug,
          description,
          is_active
        `)
        .eq('is_active', true);

      if (channelsError) throw channelsError;

      // Fetch channel stats for current month (Paris timezone)
      const currentMonth = getCurrentMonthInParis();
      const monthStart = `${currentMonth}-01`;
      
      // Calculate previous month
      const [year, month] = currentMonth.split('-');
      const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
      const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
      const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
      const prevStartDate = `${prevMonthStr}-01`;
      
      const { data: statsData, error: statsError } = await supabase
        .from('channel_stats')
        .select(`
          channel_id,
          clicks,
          reservations,
          total_covers
        `)
        .gte('date', monthStart);

      if (statsError) throw statsError;

      // Fetch previous month stats for evolution comparison
      const { data: prevStatsData, error: prevStatsError } = await supabase
        .from('channel_stats')
        .select(`
          channel_id,
          clicks,
          reservations,
          total_covers
        `)
        .gte('date', prevStartDate)
        .lt('date', monthStart);

      if (prevStatsError) throw prevStatsError;

      // Aggregate stats by channel for current month
      const channelStatsMap = new Map();
      statsData?.forEach(stat => {
        const existing = channelStatsMap.get(stat.channel_id) || { clicks: 0, reservations: 0, total_covers: 0 };
        channelStatsMap.set(stat.channel_id, {
          clicks: existing.clicks + stat.clicks,
          reservations: existing.reservations + stat.reservations,
          total_covers: existing.total_covers + stat.total_covers
        });
      });

      // Aggregate stats by channel for previous month
      const prevChannelStatsMap = new Map();
      prevStatsData?.forEach(stat => {
        const existing = prevChannelStatsMap.get(stat.channel_id) || { clicks: 0, reservations: 0, total_covers: 0 };
        prevChannelStatsMap.set(stat.channel_id, {
          clicks: existing.clicks + stat.clicks,
          reservations: existing.reservations + stat.reservations,
          total_covers: existing.total_covers + stat.total_covers
        });
      });

      // Combine channels with their stats
      const channelsWithStats: ChannelData[] = channelsData?.map(channel => {
        const stats = channelStatsMap.get(channel.id) || { clicks: 0, reservations: 0, total_covers: 0 };
        const conversion = stats.clicks > 0 ? (stats.reservations / stats.clicks) * 100 : 0;
        
        return {
          id: channel.id,
          name: channel.name,
          slug: channel.slug,
          description: channel.description,
          isActive: channel.is_active,
          clicks: stats.clicks,
          reservations: stats.reservations,
          covers: stats.total_covers,
          conversion: conversion,
          shortUrl: `${window.location.origin}/book/${channel.slug}`
        };
      }) || [];

      setChannels(channelsWithStats);

      // Calculate overall KPIs
      const totalClicks = channelsWithStats.reduce((sum, channel) => sum + channel.clicks, 0);
      const totalReservations = channelsWithStats.reduce((sum, channel) => sum + channel.reservations, 0);
      const totalCovers = channelsWithStats.reduce((sum, channel) => sum + channel.covers, 0);
      const overallConversion = totalClicks > 0 ? (totalReservations / totalClicks) * 100 : 0;

      // Calculate previous month totals for evolution
      const prevTotalClicks = Array.from(prevChannelStatsMap.values()).reduce((sum, stats) => sum + stats.clicks, 0);
      const prevTotalReservations = Array.from(prevChannelStatsMap.values()).reduce((sum, stats) => sum + stats.reservations, 0);
      const prevTotalCovers = Array.from(prevChannelStatsMap.values()).reduce((sum, stats) => sum + stats.total_covers, 0);
      const prevOverallConversion = prevTotalClicks > 0 ? (prevTotalReservations / prevTotalClicks) * 100 : 0;

      setKpis({
        totalClicks,
        totalReservations,
        totalCovers,
        conversion: overallConversion,
        evolution: {
          clicksEvolution: calculateEvolution(totalClicks, prevTotalClicks),
          reservationsEvolution: calculateEvolution(totalReservations, prevTotalReservations),
          coversEvolution: calculateEvolution(totalCovers, prevTotalCovers),
          conversionEvolution: calculateEvolution(overallConversion, prevOverallConversion)
        }
      });

    } catch (error) {
      console.error('Error fetching channels data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelsAndStats();

    // Set up real-time subscriptions
    const channelsSubscription = supabase
      .channel('channels-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'channels'
      }, () => {
        fetchChannelsAndStats();
      })
      .subscribe();

    const statsSubscription = supabase
      .channel('channel-stats-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'channel_stats'
      }, () => {
        fetchChannelsAndStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelsSubscription);
      supabase.removeChannel(statsSubscription);
    };
  }, []);

  return { channels, kpis, loading, refetch: fetchChannelsAndStats };
}