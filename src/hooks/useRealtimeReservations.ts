import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTodayInParis } from '@/lib/dateUtils';

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
}

export interface ReservationsKPIs {
  todayReservations: number;
  todayCovers: number;
  upcomingReservations: number;
  occupancyRate: number;
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

  const fetchReservations = async () => {
    try {
      const today = getTodayInParis();
      
      // Fetch reservations with channel information
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
          channels(name)
        `)
        .gte('reservation_date', today)
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });

      if (reservationsError) throw reservationsError;

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
        createdAt: reservation.created_at
      })) || [];

      setReservations(formattedReservations);

      // Calculate KPIs
      const todayReservations = formattedReservations.filter(r => r.reservationDate === today).length;
      const todayCovers = formattedReservations
        .filter(r => r.reservationDate === today)
        .reduce((sum, r) => sum + r.guestsCount, 0);
      
      const upcomingReservations = formattedReservations.length;
      
      // Mock occupancy rate calculation (you can adjust this based on your restaurant capacity)
      const totalCapacity = 120; // Example: 120 covers max per day
      const occupancyRate = Math.min((todayCovers / totalCapacity) * 100, 100);

      setKpis({
        todayReservations,
        todayCovers,
        upcomingReservations,
        occupancyRate
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
    refetch: fetchReservations 
  };
}