import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const LAST_SYNC_KEY = 'yahoo_opentable_last_sync';

let inFlight: Promise<void> | null = null;

/**
 * Relève automatique des confirmations OpenTable dans la boîte Yahoo :
 * - au montage, puis toutes les 5 minutes tant qu'une page du dashboard est ouverte
 * - immédiatement quand l'onglet redevient visible après ce délai
 */
export function useYahooOpenTableAutoSync() {
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
      if (inFlight) return inFlight;

      if (mounted.current) setSyncing(true);
      inFlight = (async () => {
        try {
          const { data, error } = await supabase.functions.invoke('sync-yahoo-opentable');
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
          console.error('Yahoo OpenTable sync error:', err);
        } finally {
          inFlight = null;
          if (mounted.current) setSyncing(false);
        }
      })();

      return inFlight;
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
