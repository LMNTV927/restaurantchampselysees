import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  utmCampaign: string | null;
  utmSource: string | null;
  isDuplicate?: boolean;
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

const calculateEvolution = (current: number, previous: number): number | null => {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
};

interface ReservationsResult {
  reservations: ReservationData[];
  duplicates: ReservationData[];
  kpis: ReservationsKPIs;
}

const mapRow = (r: any): ReservationData => ({
  id: r.id,
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  customerEmail: r.customer_email,
  reservationDate: r.reservation_date,
  reservationTime: r.reservation_time,
  guestsCount: r.guests_count,
  notes: r.notes,
  status: r.status as any,
  channelName: (r.channels as any)?.name || null,
  createdAt: r.created_at,
  source: r.source || null,
  externalId: r.external_id || null,
  isDuplicate: !!r.is_duplicate,
});

const fetchReservations = async (): Promise<ReservationsResult> => {
  const today = getTodayInParis();
  const yesterday = getDaysAgoInParis(1);

  const [allRes, yesterdayRes] = await Promise.all([
    supabase
      .from('reservations')
      .select('id, customer_name, customer_phone, customer_email, reservation_date, reservation_time, guests_count, notes, status, created_at, source, external_id, is_duplicate, channels(name)')
      .order('reservation_date', { ascending: true })
      .order('reservation_time', { ascending: true }),
    supabase
      .from('reservations')
      .select('reservation_date, guests_count')
      .eq('reservation_date', yesterday)
      .eq('is_duplicate', false),
  ]);

  if (allRes.error) throw allRes.error;
  if (yesterdayRes.error) throw yesterdayRes.error;

  const allMapped: ReservationData[] = allRes.data?.map(mapRow) || [];
  const reservations = allMapped.filter(r => !r.isDuplicate);
  const duplicates = allMapped.filter(r => r.isDuplicate);

  const todayFiltered = reservations.filter(r => isReservationToday(r.reservationDate));
  const todayReservations = todayFiltered.length;
  const todayCovers = todayFiltered.reduce((s, r) => s + r.guestsCount, 0);
  const totalCapacity = 500;
  const occupancyRate = Math.round(Math.min((todayCovers / totalCapacity) * 100, 100));

  const yesterdayCount = yesterdayRes.data?.length || 0;
  const yesterdayCovers = yesterdayRes.data?.reduce((s, r) => s + r.guests_count, 0) || 0;
  const yesterdayOccupancy = Math.round(Math.min((yesterdayCovers / totalCapacity) * 100, 100));

  return {
    reservations,
    duplicates,
    kpis: {
      todayReservations, todayCovers,
      upcomingReservations: reservations.length,
      occupancyRate,
      evolution: {
        reservationsEvolution: calculateEvolution(todayReservations, yesterdayCount),
        coversEvolution: calculateEvolution(todayCovers, yesterdayCovers),
        occupancyEvolution: calculateEvolution(occupancyRate, yesterdayOccupancy)
      }
    }
  };
};


export function useRealtimeReservations() {
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: ['reservations'],
    queryFn: fetchReservations,
    staleTime: 30000,
    initialData: {
      reservations: [],
      duplicates: [],
      kpis: { todayReservations: 0, todayCovers: 0, upcomingReservations: 0, occupancyRate: 0 }
    },

    initialDataUpdatedAt: 0
  });

  useEffect(() => {
    const sub = supabase
      .channel('reservations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['reservations'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['channels'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [queryClient]);

  const updateReservationStatus = async (reservationId: string, newStatus: 'confirmed' | 'show' | 'no_show' | 'cancelled') => {
    const { error } = await supabase.from('reservations').update({ status: newStatus }).eq('id', reservationId);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
  };

  const updateReservationNotes = async (reservationId: string, notes: string) => {
    const { error } = await supabase.from('reservations').update({ notes }).eq('id', reservationId);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
  };

  const deleteReservation = async (reservationId: string) => {
    const { error } = await supabase.from('reservations').delete().eq('id', reservationId);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['channels'] });
  };

  const restoreReservation = async (reservationId: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ is_duplicate: false, duplicate_of: null })
      .eq('id', reservationId);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['reservations'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  return {
    reservations: data!.reservations,
    duplicates: data!.duplicates,
    kpis: data!.kpis,
    loading,
    updateReservationStatus,
    updateReservationNotes,
    deleteReservation,
    restoreReservation,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['reservations'] })
  };
}

