import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const LAST_SYNC_KEY = 'google_agenda_last_sync';

let gcInFlight: Promise<void> | null = null;

/**
 * Relève automatique des confirmations OpenTable dans la boîte Yahoo :
 * - au montage, puis toutes les 5 minutes tant qu'une page du dashboard est ouverte
 * - immédiatement quand l'onglet redevient visible après ce délai
 */
export function useGoogleCalendarAutoSync() {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(() => {
    const stored = localStorage.getItem(LAST_SYNC_KEY);
    return stored ? parseInt(stored) : null;
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const runSync = async (force = false) => {
      const last = parseInt(localStorage.getItem(LAST_SYNC_KEY) ?? '0');
      if (!force && Date.now() - last < SYNC_INTERVAL_MS) return;
      if (gcInFlight) return gcInFlight;

      if (mounted.current) setSyncing(true);
      gcInFlight = (async () => {
        try {
          const { data, error } = await supabase.functions.invoke('sync-google-calendar');
          if (error) throw error;
          if ((data as any)?.error) throw new Error((data as any).error);

          const now = Date.now();
          localStorage.setItem(LAST_SYNC_KEY, now.toString());
          if (mounted.current) setLastSyncAt(now);

          const { imported = 0, updated = 0 } = (data as any) ?? {};
          if (imported > 0 || updated > 0) {
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
          }
        } catch (err) {
          console.error('Google Agenda sync error:', err);
        } finally {
          gcInFlight = null;
          if (mounted.current) setSyncing(false);
        }
      })();

      return gcInFlight;
    };

    runSync(true);
    const interval = setInterval(() => runSync(), SYNC_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === 'visible') runSync();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      mounted.current = false;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [queryClient]);

  return { syncing, lastSyncAt };
}
