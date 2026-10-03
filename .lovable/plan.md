# Corriger le calcul des réservations dans l'onglet Données

## Diagnostic (vérifié dans le code et en base)

- L'attribution au bon mois est **déjà correcte** : toutes les requêtes de l'onglet Données (`useRealtimeChannelsData`, `useMonthlyData`, rapports PDF/CSV) filtrent sur `reservation_date` (date de la venue), pas sur la date d'enregistrement. Une réservation faite en octobre pour novembre n'apparaît donc que dans les données de novembre.
- **Défaut réel trouvé** : les cartes KPI, le camembert, le graphique jour par jour et le tableau « Performance par canal » comptent **aussi les réservations annulées**. En octobre : 69 réservations comptées dont **15 annulées** — une réservation annulée n'a pas « eu lieu », ce qui gonfle tous les chiffres du mois.
- Le bloc « Réservations prises » du Dashboard (basé sur la date d'enregistrement) reste tel quel, comme demandé.

## Changements prévus

1. **`src/lib/analyticsAggregation.ts`** — exclure les réservations `status = 'cancelled'` de l'agrégation (KPI, camembert, performance par canal, Search/PMax). Les statuts `confirmed`, `show` et `no_show` restent comptés (une table a été tenue pour le client).
2. **`src/hooks/useRealtimeChannelsData.ts`** — ajouter `status` au `select` et filtrer `.neq('status', 'cancelled')` sur les requêtes du mois courant et du mois précédent (évolution cohérente).
3. **`src/hooks/useMonthlyData.ts`** — même filtre `.neq('status', 'cancelled')` sur le mois sélectionné et le mois précédent (camembert, graphique jour par jour, évolution).
4. **Rapports PDF et export CSV** (`usePDFReport`, export CSV de DataSection) — ils utilisent les mêmes données, donc automatiquement corrigés ; vérifier que les totaux affichés excluent bien les annulées.
5. **Vérification à l'écran** — ouvrir l'onglet Données sur octobre : les KPI doivent afficher 54 réservations (69 − 15 annulées) au lieu de 69, et le camembert / tableau par canal doivent suivre.

## Ce qui ne change pas

- Attribution par mois de venue (déjà en place, conservée).
- Bloc « Réservations prises » du Dashboard : toujours basé sur la date d'enregistrement.
- Onglets Réservations, Liens, Clients : inchangés (les annulées restent visibles dans la liste des réservations, avec leur statut « Annulée »).
- Aucune migration, aucune écriture en base, aucune nouvelle dépendance.
