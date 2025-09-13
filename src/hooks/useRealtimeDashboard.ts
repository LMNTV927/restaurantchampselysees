import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTodayInParis, getDaysAgoInParis, getTimeAgoInParis } from '@/lib/dateUtils';

export interface DashboardKPIs {
  reservations: number;
  covers: number;
  occupancy: number;
  revenue: number;
}

export interface WeeklyTrendData {
  day: string;
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
  weeklyTrend: WeeklyTrendData[];
  recentActivity: ActivityItem[];
  alerts: Alert[];
}

export function useRealtimeDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    todayKPIs: { reservations: 0, covers: 0, occupancy: 0, revenue: 0 },
    weeklyTrend: [],
    recentActivity: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const today = getTodayInParis();
      const sevenDaysAgo = getDaysAgoInParis(7);

      // Fetch today's reservations
      const { data: todayReservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('guests_count, status, created_at, customer_name, channels(name)')
        .eq('reservation_date', today);

      if (reservationsError) throw reservationsError;

      // Fetch weekly data for trends
      const { data: weeklyReservations, error: weeklyError } = await supabase
        .from('reservations')
        .select('reservation_date, guests_count, created_at')
        .gte('reservation_date', sevenDaysAgo)
        .lte('reservation_date', today);

      if (weeklyError) throw weeklyError;

      // Calculate today's KPIs
      const todayReservationsCount = todayReservations?.length || 0;
      const todayCovers = todayReservations?.reduce((sum, r) => sum + r.guests_count, 0) || 0;
      const totalCapacity = 120; // Restaurant capacity
      const occupancy = Math.min((todayCovers / totalCapacity) * 100, 100);
      const avgRevenuePerCover = 45; // Average revenue per cover in euros
      const revenue = todayCovers * avgRevenuePerCover;

      // Calculate weekly trend
      const weeklyTrendMap = new Map<string, { day: string; reservations: number; covers: number }>();
      
      for (let i = 6; i >= 0; i--) {
        const dateStr = getDaysAgoInParis(i);
        const date = new Date(dateStr + 'T12:00:00');
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short', timeZone: 'Europe/Paris' });
        weeklyTrendMap.set(dateStr, { day: dayName, reservations: 0, covers: 0 });
      }

      weeklyReservations?.forEach(reservation => {
        const existing = weeklyTrendMap.get(reservation.reservation_date);
        if (existing) {
          existing.reservations += 1;
          existing.covers += reservation.guests_count;
        }
      });

      const weeklyTrend: WeeklyTrendData[] = Array.from(weeklyTrendMap.values());

      // Generate recent activity from reservations
      const recentActivity: ActivityItem[] = todayReservations
        ?.slice(0, 4)
        .map((reservation, index) => ({
          id: `activity-${index}`,
          type: 'reservation' as const,
           message: `Nouvelle réservation via ${(reservation.channels as any)?.name || 'Web'}`,
           customer: reservation.customer_name,
           time: getTimeAgoInParis(reservation.created_at),
           status: reservation.status as any
        })) || [];

      // Generate alerts based on data
      const alerts: Alert[] = [];
      if (todayReservationsCount > 25) {
        alerts.push({
          id: 'high-volume',
          type: 'warning',
          message: `Pic d'affluence prévu ce soir (${todayReservationsCount} réservations)`,
          priority: 'high'
        });
      }

      const pendingReservations = todayReservations?.filter(r => r.status === 'confirmed').length || 0;
      if (pendingReservations > 3) {
        alerts.push({
          id: 'pending-confirmations',
          type: 'info',
          message: `${pendingReservations} réservations en attente de confirmation`,
          priority: 'medium'
        });
      }

      setDashboardData({
        todayKPIs: {
          reservations: todayReservationsCount,
          covers: todayCovers,
          occupancy,
          revenue
        },
        weeklyTrend,
        recentActivity,
        alerts
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions
    const reservationsSubscription = supabase
      .channel('dashboard-reservations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reservations'
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const statsSubscription = supabase
      .channel('dashboard-stats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'channel_stats'
      }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(reservationsSubscription);
      supabase.removeChannel(statsSubscription);
    };
  }, []);

  return { dashboardData, loading, refetch: fetchDashboardData };
}