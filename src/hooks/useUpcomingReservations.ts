import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchAllRows } from '@/lib/fetchAllRows';
import { getTodayInParis, getDaysFromNowInParis } from '@/lib/dateUtils';

export interface UpcomingReservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  guestsCount: number;
  reservationDate: string;
  reservationTime: string;
  status: 'confirmed' | 'show' | 'no_show' | 'cancelled';
  notes: string | null;
  channelName: string | null;
}

export interface UpcomingDayCount {
  date: string;
  count: number;
  covers: number;
}

const hasKnownTime = (time: string): boolean => /^\d{2}:\d{2}/.test(time ?? '');

const mapRow = (r: any): UpcomingReservation => ({
  id: r.id,
  customerName: r.customer_name,
  customerPhone: r.customer_phone,
  customerEmail: r.customer_email,
  guestsCount: r.guests_count,
  reservationDate: r.reservation_date,
  reservationTime: r.reservation_time,
  status: r.status as UpcomingReservation['status'],
  notes: r.notes,
  channelName: (r.channels as any)?.name || null,
});

const fetchSelectedDay = async (day: string): Promise<UpcomingReservation[]> => {
  const { data, error } = await fetchAllRows<any>((from, to) => supabase
    .from('reservations')
    .select('id, customer_name, customer_phone, customer_email, guests_count, reservation_date, reservation_time, status, notes, is_duplicate, channels(name)')
    .eq('reservation_date', day)
    .eq('is_duplicate', false)
    .neq('status', 'cancelled')
    .order('id', { ascending: true })
    .range(from, to));

  if (error) throw error;

  // Tri par heure connue d'abord (HH:MM croissant) ; les horaires "À confirmer"
  // (import TheFork sans heure précise) sont placés à la fin plutôt que de casser le tri.
  const mapped = (data || []).map(mapRow);
  return mapped.sort((a, b) => {
    const aKnown = hasKnownTime(a.reservationTime);
    const bKnown = hasKnownTime(b.reservationTime);
    if (aKnown && !bKnown) return -1;
    if (!aKnown && bKnown) return 1;
    if (!aKnown && !bKnown) return 0;
    return a.reservationTime.localeCompare(b.reservationTime);
  });
};

const fetchNext7Summary = async (): Promise<UpcomingDayCount[]> => {
  const today = getTodayInParis();
  const horizonEnd = getDaysFromNowInParis(6);

  const { data, error } = await fetchAllRows<any>((from, to) => supabase
    .from('reservations')
    .select('reservation_date, guests_count')
    .gte('reservation_date', today)
    .lte('reservation_date', horizonEnd)
    .eq('is_duplicate', false)
    .neq('status', 'cancelled')
    .order('id', { ascending: true })
    .range(from, to));

  if (error) throw error;

  const byDate = new Map<string, { count: number; covers: number }>();
  (data || []).forEach((r: any) => {
    const current = byDate.get(r.reservation_date) || { count: 0, covers: 0 };
    current.count += 1;
    current.covers += r.guests_count;
    byDate.set(r.reservation_date, current);
  });

  return Array.from({ length: 7 }, (_, i) => {
    const date = getDaysFromNowInParis(i);
    const entry = byDate.get(date) || { count: 0, covers: 0 };
    return { date, count: entry.count, covers: entry.covers };
  });
};

export function useUpcomingReservations(day: string) {
  const dayQuery = useQuery({
    queryKey: ['reservations-upcoming-day', day],
    queryFn: () => fetchSelectedDay(day),
    staleTime: 30000,
  });

  const summaryQuery = useQuery({
    queryKey: ['reservations-upcoming-summary'],
    queryFn: fetchNext7Summary,
    staleTime: 30000,
  });

  const reservations = dayQuery.data || [];

  return {
    reservations,
    count: reservations.length,
    covers: reservations.reduce((sum, r) => sum + r.guestsCount, 0),
    next7: summaryQuery.data || [],
    loading: dayQuery.isLoading || summaryQuery.isLoading,
  };
}
