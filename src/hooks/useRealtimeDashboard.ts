import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTodayInParis, getDaysAgoInParis, getTimeAgoInParis, isReservationToday, getCurrentMonthInParis } from '@/lib/dateUtils';

export interface DashboardKPIs {
  reservations: number;
  covers: number;
  occupancy: number;
  revenue: number;
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

export function useRealtimeDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    todayKPIs: { reservations: 0, covers: 0, occupancy: 0, revenue: 0 },
    monthlyTrend: [],
    recentActivity: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const today = getTodayInParis();
      const currentMonth = getCurrentMonthInParis();
      const monthStart = `${currentMonth}-01`;

      // Fetch today's reservations (ALL reservations for the current date, from midnight to midnight)
      // This includes both past and future reservations for today
      // Example: on Sept 13 at 23h, we show ALL Sept 13 reservations (even those at 19h which are past)
      console.log('Dashboard - Date du jour (Paris):', today);
      const { data: todayReservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('guests_count, status, created_at, customer_name, channels(name)')
        .eq('reservation_date', today);

      console.log('Dashboard - Réservations d\'aujourd\'hui trouvées:', todayReservations?.length || 0);

      if (reservationsError) throw reservationsError;

      // Fetch monthly data for trends
      const { data: monthlyReservations, error: monthlyError } = await supabase
        .from('reservations')
        .select('reservation_date, guests_count, created_at')
        .gte('reservation_date', monthStart)
        .lte('reservation_date', today);

      if (monthlyError) throw monthlyError;

      // Calculate today's KPIs
      const todayReservationsCount = todayReservations?.length || 0;
      const todayCovers = todayReservations?.reduce((sum, r) => sum + r.guests_count, 0) || 0;
      const totalCapacity = 1000; // Restaurant capacity
      const occupancy = Math.min((todayCovers / totalCapacity) * 100, 100);
      const avgRevenuePerCover = 45; // Average revenue per cover in euros
      const revenue = todayCovers * avgRevenuePerCover;

      // Calculate monthly trend
      const monthlyTrendMap = new Map<string, { date: string; day: number; reservations: number; covers: number }>();
      
      // Get current month and year
      const [year, month] = currentMonth.split('-');
      const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
      
      // Initialize all days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentMonth}-${day.toString().padStart(2, '0')}`;
        monthlyTrendMap.set(dateStr, { 
          date: dateStr, 
          day: day, 
          reservations: 0, 
          covers: 0 
        });
      }

      // Populate with actual reservation data
      monthlyReservations?.forEach(reservation => {
        const existing = monthlyTrendMap.get(reservation.reservation_date);
        if (existing) {
          existing.reservations += 1;
          existing.covers += reservation.guests_count;
        }
      });

      const monthlyTrend: MonthlyTrendData[] = Array.from(monthlyTrendMap.values());

      // Generate recent activity from reservations
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

      setDashboardData({
        todayKPIs: {
          reservations: todayReservationsCount,
          covers: todayCovers,
          occupancy,
          revenue
        },
        monthlyTrend,
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