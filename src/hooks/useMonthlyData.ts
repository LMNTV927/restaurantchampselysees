import { useState } from 'react';
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

export function useMonthlyData() {
  const [loading, setLoading] = useState(false);

  const calculateEvolution = (current: number, previous: number): number | null => {
    if (previous === 0) return current > 0 ? 100 : null;
    return ((current - previous) / previous) * 100;
  };

  const fetchMonthlyData = async (selectedMonth: string): Promise<MonthlyData> => {
    setLoading(true);
    
    try {
      // Parse selected month (format: "2024-11")
      const [year, month] = selectedMonth.split('-');
      const startDate = `${year}-${month}-01`;
      
      // Calculate end date properly (next month)
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

      // Calculate previous month dates
      const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
      const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
      const prevStartDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`;
      const prevEndDate = startDate; // Current month start = previous month end

      // Fetch channels
      const { data: channelsData, error: channelsError } = await supabase
        .from('channels')
        .select('id, name, slug, description, is_active')
        .eq('is_active', true);

      if (channelsError) throw channelsError;

      // Fetch channel stats for the selected month
      const { data: statsData, error: statsError } = await supabase
        .from('channel_stats')
        .select('channel_id, clicks, reservations, total_covers, date')
        .gte('date', startDate)
        .lt('date', endDate);

      if (statsError) throw statsError;

      // Fetch channel stats for the previous month
      const { data: prevStatsData, error: prevStatsError } = await supabase
        .from('channel_stats')
        .select('channel_id, clicks, reservations, total_covers, date')
        .gte('date', prevStartDate)
        .lt('date', prevEndDate);

      if (prevStatsError) throw prevStatsError;

      // Fetch reservations for the selected month with channel information
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select(`
          *,
          channels(name)
        `)
        .gte('created_at', startDate)
        .lt('created_at', endDate)
        .order('created_at', { ascending: false });

      if (reservationsError) {
        console.error('Reservations error:', reservationsError);
        throw reservationsError;
      }

      // Aggregate stats by channel for the current month
      const channelStatsMap = new Map();
      statsData?.forEach(stat => {
        const existing = channelStatsMap.get(stat.channel_id) || { 
          clicks: 0, 
          reservations: 0, 
          total_covers: 0 
        };
        channelStatsMap.set(stat.channel_id, {
          clicks: existing.clicks + stat.clicks,
          reservations: existing.reservations + stat.reservations,
          total_covers: existing.total_covers + stat.total_covers
        });
      });

      // Aggregate stats by channel for the previous month
      const prevChannelStatsMap = new Map();
      prevStatsData?.forEach(stat => {
        const existing = prevChannelStatsMap.get(stat.channel_id) || { 
          clicks: 0, 
          reservations: 0, 
          total_covers: 0 
        };
        prevChannelStatsMap.set(stat.channel_id, {
          clicks: existing.clicks + stat.clicks,
          reservations: existing.reservations + stat.reservations,
          total_covers: existing.total_covers + stat.total_covers
        });
      });

      // Combine channels with their monthly stats
      const channelsWithStats: ChannelData[] = channelsData?.map(channel => {
        const stats = channelStatsMap.get(channel.id) || { 
          clicks: 0, 
          reservations: 0, 
          total_covers: 0 
        };
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

      // Calculate monthly KPIs
      const totalClicks = channelsWithStats.reduce((sum, channel) => sum + channel.clicks, 0);
      const totalReservations = channelsWithStats.reduce((sum, channel) => sum + channel.reservations, 0);
      const totalCovers = channelsWithStats.reduce((sum, channel) => sum + channel.covers, 0);
      const overallConversion = totalClicks > 0 ? (totalReservations / totalClicks) * 100 : 0;

      // Calculate previous month totals for evolution
      const prevTotalClicks = Array.from(prevChannelStatsMap.values()).reduce((sum, stats) => sum + stats.clicks, 0);
      const prevTotalReservations = Array.from(prevChannelStatsMap.values()).reduce((sum, stats) => sum + stats.reservations, 0);
      const prevTotalCovers = Array.from(prevChannelStatsMap.values()).reduce((sum, stats) => sum + stats.total_covers, 0);
      const prevOverallConversion = prevTotalClicks > 0 ? (prevTotalReservations / prevTotalClicks) * 100 : 0;

      const monthlyKpis: ChannelsKPIs = {
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
      };

      // Format reservations data
      const formattedReservations: ReservationData[] = reservationsData?.map(reservation => ({
        id: reservation.id,
        customer_name: reservation.customer_name,
        customer_email: reservation.customer_email,
        customer_phone: reservation.customer_phone,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        guests_count: reservation.guests_count,
        status: reservation.status,
        notes: reservation.notes,
        created_at: reservation.created_at,
        channel_id: reservation.channel_id,
        channel_name: (reservation.channels as any)?.name || 'Canal inconnu'
      })) || [];

      return {
        channels: channelsWithStats,
        kpis: monthlyKpis,
        reservations: formattedReservations
      };

    } catch (error) {
      console.error('Error fetching monthly data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchMonthlyData, loading };
}