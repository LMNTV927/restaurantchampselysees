import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTodayInParis, isReservationToday, getDaysAgoInParis } from '@/lib/dateUtils';

export interface ReservationData {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  reservationDate: string;
  reservationTime: string;
  guestsCount: number;
  notes: string | null;
  status: 'confirmed' | 'show' | 'no_show' | 'cancelled';
  channelName: string | null;
  createdAt: string;
  source: string | null;
  externalId: string | null;
}

export interface ReservationsKPIs {
  todayReservations: number;
  todayCovers: number;
  upcomingReservations: number;
  occupancyRate: number;
  evolution?: {
    reservationsEvolution: number | null;
    coversEvolution: number | null;
    occupancyEvolution: number | null;
  };
}

export function useRealtimeReservations() {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [kpis, setKpis] = useState<ReservationsKPIs>({
    todayReservations: 0,
    todayCovers: 0,
    upcomingReservations: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);

  const calculateEvolution = (current: number, previous: number): number | null => {
    if (previous === 0) return current > 0 ? 100 : null;
    return Math.round(((current - previous) / previous) * 100);
  };

  const fetchReservations = async () => {
    try {
      const today = getTodayInParis();
      const yesterday = getDaysAgoInParis(1);
      console.log('Date du jour (Paris):', today);
      
      // Fetch ALL reservations (including past ones) for the reservations list
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select(`
          id,
          customer_name,
          customer_phone,
          customer_email,
          reservation_date,
          reservation_time,
          guests_count,
          notes,
          status,
          created_at,
          source,
          external_id,
          channels(name)
        `)
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });

      console.log('Toutes les réservations trouvées:', reservationsData?.length || 0);

      if (reservationsError) throw reservationsError;

      // Fetch yesterday's reservations for evolution comparison
      const { data: yesterdayReservationsData, error: yesterdayError } = await supabase
        .from('reservations')
        .select(`
          reservation_date,
          guests_count
        `)
        .eq('reservation_date', yesterday);

      if (yesterdayError) throw yesterdayError;

      const formattedReservations: ReservationData[] = reservationsData?.map(reservation => ({
        id: reservation.id,
        customerName: reservation.customer_name,
        customerPhone: reservation.customer_phone,
        customerEmail: reservation.customer_email,
        reservationDate: reservation.reservation_date,
        reservationTime: reservation.reservation_time,
        guestsCount: reservation.guests_count,
        notes: reservation.notes,
        status: reservation.status as any,
        channelName: (reservation.channels as any)?.name || null,
        createdAt: reservation.created_at,
        source: (reservation as any).source || null,
        externalId: (reservation as any).external_id || null,
      })) || [];

      setReservations(formattedReservations);

      // Calculate KPIs - Filter reservations by exact date match (midnight to midnight)
      // This includes ALL reservations for today (past and future within the same day)
      // Important: même si une réservation est passée, elle compte pour les KPIs du jour
      const todayReservationsFiltered = formattedReservations.filter(r => isReservationToday(r.reservationDate));
      console.log('Réservations filtrées pour aujourd\'hui:', todayReservationsFiltered.length);
      console.log('Détail des réservations d\'aujourd\'hui:', todayReservationsFiltered.map(r => ({ date: r.reservationDate, time: r.reservationTime, name: r.customerName })));
      
      const todayReservations = todayReservationsFiltered.length;
      const todayCovers = todayReservationsFiltered.reduce((sum, r) => sum + r.guestsCount, 0);
      
      const upcomingReservations = formattedReservations.length;
      
      // Mock occupancy rate calculation (you can adjust this based on your restaurant capacity)
      const totalCapacity = 500; // Restaurant capacity: 500 covers max per day
      const occupancyRate = Math.round(Math.min((todayCovers / totalCapacity) * 100, 100));

      // Calculate yesterday's KPIs for evolution
      const yesterdayReservations = yesterdayReservationsData?.length || 0;
      const yesterdayCovers = yesterdayReservationsData?.reduce((sum, r) => sum + r.guests_count, 0) || 0;
      const yesterdayOccupancyRate = Math.round(Math.min((yesterdayCovers / totalCapacity) * 100, 100));

      setKpis({
        todayReservations,
        todayCovers,
        upcomingReservations,
        occupancyRate,
        evolution: {
          reservationsEvolution: calculateEvolution(todayReservations, yesterdayReservations),
          coversEvolution: calculateEvolution(todayCovers, yesterdayCovers),
          occupancyEvolution: calculateEvolution(occupancyRate, yesterdayOccupancyRate)
        }
      });

    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, newStatus: 'confirmed' | 'show' | 'no_show' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', reservationId);

      if (error) throw error;

      // Update local state
      setReservations(prev => prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: newStatus }
          : reservation
      ));

    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  };

  const updateReservationNotes = async (reservationId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ notes })
        .eq('id', reservationId);

      if (error) throw error;

      // Update local state
      setReservations(prev => prev.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, notes }
          : reservation
      ));

    } catch (error) {
      console.error('Error updating reservation notes:', error);
      throw error;
    }
  };

  const deleteReservation = async (reservationId: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;

      // Update local state
      setReservations(prev => prev.filter(reservation => reservation.id !== reservationId));

    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReservations();

    // Set up real-time subscription
    const reservationsSubscription = supabase
      .channel('reservations-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reservations'
      }, () => {
        fetchReservations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(reservationsSubscription);
    };
  }, []);

  return { 
    reservations, 
    kpis, 
    loading, 
    updateReservationStatus,
    updateReservationNotes,
    deleteReservation,
    refetch: fetchReservations 
  };
}