import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getTodayInParis, getDaysAgoInParis, getTimeAgoInParis, getCurrentMonthInParis } from '@/lib/dateUtils';
import { useGoogleCalendarAutoSync } from './useGoogleCalendarAutoSync';
import { useYahooOpenTableAutoSync } from './useYahooOpenTableAutoSync';

export interface DashboardKPIs {
  reservations: number;
  covers: number;
  occupancy: number;
  revenue: number;
  evolution?: {
    reservationsEvolution: number | null;
    coversEvolution: number | null;
    occupancyEvolution: number | null;
  };
}

export interface MonthlyTrendData {
  date: string;
  day: number;
  reservations: number;
  covers: number;
}

export interface ActivityItem {
  id: string;
  type: 'reservation' | 'click' | 'show';
  message: string;
  customer?: string;
  time: string;
  status?: 'confirmed' | 'show' | 'no_show' | 'cancelled';
}

export interface Alert {
  id: string;
  type: 'warning' | 'info';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DashboardData {
  todayKPIs: DashboardKPIs;
  monthlyTrend: MonthlyTrendData[];
  recentActivity: ActivityItem[];
  alerts: Alert[];
}

const calculateEvolution = (current: number, previous: number): number | null => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};

const fetchDashboardData = async (): Promise<DashboardData> => {
  const today = getTodayInParis();
  const yesterday = getDaysAgoInParis(1);
  const currentMonth = getCurrentMonthInParis();
  const monthStart = `${currentMonth}-01`;

  const [todayRes, yesterdayRes, monthlyRes] = await Promise.all([
    supabase
      .from('reservations')
      .select('guests_count, status, created_at, customer_name, channels(name)')
      .eq('reservation_date', today)
      .eq('is_duplicate', false),
    supabase
      .from('reservations')
      .select('guests_count')
      .eq('reservation_date', yesterday)
      .eq('is_duplicate', false),
    supabase
      .from('reservations')
      .select('reservation_date, guests_count, created_at')
      .gte('reservation_date', monthStart)
      .lte('reservation_date', today)
      .eq('is_duplicate', false),
  ]);


  if (todayRes.error) throw todayRes.error;
  if (yesterdayRes.error) throw yesterdayRes.error;
  if (monthlyRes.error) throw monthlyRes.error;

  const todayReservations = todayRes.data;
  const yesterdayReservations = yesterdayRes.data;
  const monthlyReservations = monthlyRes.data;

  const todayReservationsCount = todayReservations?.length || 0;
  const todayCovers = todayReservations?.reduce((sum, r) => sum + r.guests_count, 0) || 0;
  const totalCapacity = 500;
  const todayOccupancy = Math.round(Math.min((todayCovers / totalCapacity) * 100, 100));
  const revenue = todayCovers * 45;

  const yesterdayReservationsCount = yesterdayReservations?.length || 0;
  const yesterdayCovers = yesterdayReservations?.reduce((sum, r) => sum + r.guests_count, 0) || 0;
  const yesterdayOccupancy = Math.round(Math.min((yesterdayCovers / totalCapacity) * 100, 100));

  // Monthly trend
  const [year, month] = currentMonth.split('-');
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const monthlyTrendMap = new Map<string, MonthlyTrendData>();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentMonth}-${day.toString().padStart(2, '0')}`;
    monthlyTrendMap.set(dateStr, { date: dateStr, day, reservations: 0, covers: 0 });
  }
  monthlyReservations?.forEach(r => {
    const existing = monthlyTrendMap.get(r.reservation_date);
    if (existing) {
      existing.reservations += 1;
      existing.covers += r.guests_count;
    }
  });

  const recentActivity: ActivityItem[] = todayReservations
    ?.slice(0, 5)
    .map((reservation, index) => ({
      id: `activity-${index}`,
      type: 'reservation' as const,
      message: `Nouvelle réservation via ${(reservation.channels as any)?.name || 'Web'}`,
      customer: reservation.customer_name,
      time: getTimeAgoInParis(reservation.created_at),
      status: reservation.status as any
    })) || [];

  const alerts: Alert[] = [];
  if (todayReservationsCount > 25) {
    alerts.push({
      id: 'high-volume',
      type: 'warning',
      message: `Pic d'affluence prévu ce soir (${todayReservationsCount} réservations)`,
      priority: 'high'
    });
  }

  return {
    todayKPIs: {
      reservations: todayReservationsCount,
      covers: todayCovers,
      occupancy: todayOccupancy,
      revenue,
      evolution: {
        reservationsEvolution: calculateEvolution(todayReservationsCount, yesterdayReservationsCount),
        coversEvolution: calculateEvolution(todayCovers, yesterdayCovers),
        occupancyEvolution: calculateEvolution(todayOccupancy, yesterdayOccupancy)
      }
    },
    monthlyTrend: Array.from(monthlyTrendMap.values()),
    recentActivity,
    alerts
  };
};

export function useRealtimeDashboard() {
  const queryClient = useQueryClient();

  // Google Agenda auto-sync (every 5 min, no manual action needed)
  useGoogleCalendarAutoSync();

  // Yahoo OpenTable auto-sync (every 5 min) — relevé des confirmations OpenTable dans la boîte Yahoo
  useYahooOpenTableAutoSync();

  // Trigger followup emails check on dashboard load (every hour)
  useEffect(() => {
    const lastCheck = sessionStorage.getItem('followup_last_check');
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    if (!lastCheck || (now - parseInt(lastCheck)) > ONE_HOUR) {
      sessionStorage.setItem('followup_last_check', now.toString());
      supabase.functions.invoke('send-followup-thankyou').then(({ data, error }) => {
        if (error) console.error('Followup check error:', error);
        else console.log('Followup check:', data);
      });
    }
  }, []);

  // Rappels 24h + détection de doublons (max 1 fois par heure)
  useEffect(() => {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();

    const lastDedupe = localStorage.getItem('dedupe_last_check');
    if (!lastDedupe || (now - parseInt(lastDedupe)) > ONE_HOUR) {
      localStorage.setItem('dedupe_last_check', now.toString());
      supabase.functions.invoke('dedupe-reservations').then(({ data, error }) => {
        if (error) console.error('Dedupe error:', error);
        else {
          console.log('Dedupe:', data);
          queryClient.invalidateQueries({ queryKey: ['reservations'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
      });
    }

    const lastReminder = localStorage.getItem('reminder_last_check');
    if (!lastReminder || (now - parseInt(lastReminder)) > ONE_HOUR) {
      localStorage.setItem('reminder_last_check', now.toString());
      supabase.functions.invoke('send-reservation-reminder').then(({ data, error }) => {
        if (error) console.error('Reminder error:', error);
        else console.log('Reminders:', data);
      });
    }
  }, [queryClient]);







  const { data: dashboardData, isLoading: loading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 30000,
    initialData: {
      todayKPIs: { reservations: 0, covers: 0, occupancy: 0, revenue: 0 },
      monthlyTrend: [],
      recentActivity: [],
      alerts: []
    },
    initialDataUpdatedAt: 0
  });

  useEffect(() => {
    const sub = supabase
      .channel('dashboard-reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channel_stats' }, () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [queryClient]);

  return {
    dashboardData: dashboardData!,
    loading,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  };
}
