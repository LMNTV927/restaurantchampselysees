

## Diagnostic

Le ralentissement lors du changement d'onglet est causé par le fait que chaque section (Dashboard, Liens, Reservations, Donnees) possede son propre hook qui refait toutes les requetes a la base de donnees a chaque montage. Il n'y a aucune mise en cache : quand tu passes de "Dashboard" a "Liens", le composant Dashboard est detruit puis "Liens" est monte et relance 4-5 requetes reseau depuis zero.

De plus, les network requests montrent que certaines requetes sont dupliquees (channels et channel_stats sont appeles 3-4 fois simultanement).

## Solution

Migrer les hooks de donnees vers **React Query** (deja installe dans le projet via `@tanstack/react-query`) pour beneficier du cache automatique. Les donnees restent en memoire quand on change d'onglet, donc le retour est instantane.

### Modifications

**1. `src/hooks/useRealtimeDashboard.ts`**
- Remplacer `useState`/`useEffect` par `useQuery` de React Query
- La cle de cache (`queryKey`) garantit que les donnees sont gardees en memoire
- Le realtime subscription invalide le cache au lieu de refetcher directement
- `staleTime: 30000` (30s) pour eviter les refetch inutiles

**2. `src/hooks/useRealtimeChannelsData.ts`**
- Meme approche : `useQuery` avec cache
- Les subscriptions realtime appellent `queryClient.invalidateQueries()` au lieu de refetcher

**3. `src/hooks/useRealtimeReservations.ts`**
- Meme approche avec `useQuery`
- Les mutations (updateStatus, delete, etc.) invalident le cache

**4. `src/components/Data/DataSection.tsx`** (et `useMonthlyData.ts`)
- Utiliser `useQuery` avec la cle incluant le mois selectionne

### Resultat attendu
- Changement d'onglet instantane (donnees servies depuis le cache)
- Les subscriptions realtime continuent de mettre a jour les donnees en arriere-plan
- Moins de requetes reseau dupliquees

