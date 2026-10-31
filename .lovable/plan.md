# Aucune réservation ne doit disparaître de l'affichage

## Problème trouvé (confirmé)
La base contient **1 022 réservations**. Le dashboard n'en charge que **1 000 maximum** par demande, triées de la plus ancienne à la plus lointaine. Résultat : les **22 réservations les plus lointaines** (27/11 → 31/12, dont Romi Oigman, Elizabeth Barnes, Catherine Delaune, Yasushi Taira…) **ne s'affichent pas** dans la liste Réservations, ni dans la fiche client, ni dans « Clients ». Chaque nouvelle réservation en fera disparaître une de plus.

Les mêmes limites menacent les Données/Analytics (totaux mensuels, camemberts) dès qu'on dépasse 1 000 lignes sur une période.

## Corrections
1. **Liste des réservations** : charger toutes les réservations par paquets de 1 000 jusqu'à la dernière, quelle que soit la date (aujourd'hui ou dans 6 mois).
2. **Données / Analytics / Dashboard** : même chargement complet pour les calculs (couverts, réservations, canaux), pour que les chiffres restent justes.
3. **Contrôle croisé** : comparer le nombre de réservations en base avec le nombre affiché pour chaque jour à venir (aujourd'hui → 31/12) et vérifier les 22 réservations listées ci-dessus à l'écran, dans l'onglet « Réservations passées / futures » (ex. 31/12).
4. Vérifier qu'aucune réservation n'est masquée à tort comme doublon pour les dates futures (63 doublons masqués actuellement, à recontrôler un par un : même numéro, même jour, moins de 3 h d'écart).
5. Ajouter un petit test automatique garantissant qu'au-delà de 1 000 réservations, tout est bien chargé.

Aucune réservation n'est modifiée ou supprimée ; aucun changement visuel.

## Détails techniques
- Helper `fetchAllRows` paginant avec `.range(from, from+999)` jusqu'à une page incomplète.
- Appliqué à `useRealtimeReservations.ts`, `useMonthlyData.ts`, `useRealtimeChannelsData.ts`, `useRealtimeDashboard.ts`, `useReservationsTaken.ts`, `useUpcomingReservations.ts` (requêtes sans filtre de jour étroit).
- Vérification Playwright connectée + requêtes SQL par date.
