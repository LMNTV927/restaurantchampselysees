import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ReservationTaken {
  id: string;
  createdAt: string;
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

const getShiftedDay = (day: string, offsetDays: number): string => {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const parisDayOf = (isoTimestamp: string): string =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris' }).format(new Date(isoTimestamp));

const fetchReservationsTaken = async (day: string): Promise<ReservationTaken[]> => {
  const rangeStart = `${getShiftedDay(day, -1)}T00:00:00Z`;
  const rangeEnd = `${getShiftedDay(day, 1)}T23:59:59Z`;

  const { data, error } = await supabase
    .from('reservations')
    .select('id, created_at, customer_name, customer_phone, customer_email, guests_count, reservation_date, reservation_time, status, notes, is_duplicate, channels(name)')
    .eq('is_duplicate', false)
    .gte('created_at', rangeStart)
    .lte('created_at', rangeEnd)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || [])
    .filter((r: any) => parisDayOf(r.created_at) === day)
    .map((r: any) => ({
      id: r.id,
      createdAt: r.created_at,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      customerEmail: r.customer_email,
      guestsCount: r.guests_count,
      reservationDate: r.reservation_date,
      reservationTime: r.reservation_time,
      status: r.status as ReservationTaken['status'],
      notes: r.notes,
      channelName: (r.channels as any)?.name || null,
    }));
};

export function useReservationsTaken(day: string) {
  const { data, isLoading: loading } = useQuery({
    queryKey: ['reservations-taken', day],
    queryFn: () => fetchReservationsTaken(day),
    staleTime: 30000,
  });

  return {
    reservations: data || [],
    count: data?.length || 0,
    loading,
  };
}
