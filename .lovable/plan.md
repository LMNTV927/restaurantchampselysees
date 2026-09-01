# Synchronisation Google Agenda 100% automatique

## Objectif
Plus aucun bouton à presser : les réservations de l'agenda Google apparaissent seules dans le dashboard.

## Ce qui change

1. **Synchronisation automatique en continu**
   - Déclenchement dès l'ouverture du dashboard (déjà en place, limité à 1×/heure) → passage à **toutes les 5 minutes tant que le dashboard est ouvert**.
   - Relance immédiate quand l'onglet redevient actif après une inactivité (retour sur l'écran).
   - Fonctionne aussi bien depuis la page Tableau de bord que depuis la page Réservations.

2. **Retrait du bouton manuel**
   - Le bouton « Synchroniser Google Agenda » disparaît de la page Réservations.
   - À la place, un petit indicateur discret « Agenda synchronisé il y a X min » (avec une icône qui tourne pendant la synchro).

3. **Rafraîchissement automatique de la liste**
   - Dès qu'une nouvelle réservation est importée, la liste et les indicateurs se mettent à jour tout seuls (aucun rechargement de page).

## Note sur la synchro « même dashboard fermé »
Une synchro serveur permanente (toutes les X minutes, même sans personne connecté) passerait par une tâche planifiée en base — approche écartée sur ce projet. La solution retenue couvre le besoin réel : dès que quelqu'un de l'équipe a le dashboard ouvert, tout est à jour en quelques minutes. Si vous voulez malgré tout une synchro permanente côté serveur, dites-le et je vous propose l'option.

## Détails techniques
- `src/hooks/useRealtimeDashboard.ts` : remplacer le garde-fou `sessionStorage` d'1 h par un `setInterval` de 5 min + écouteur `visibilitychange`, avec invalidation des caches `dashboard` et `reservations`.
- Extraire cette logique dans un petit hook `useGoogleCalendarAutoSync` réutilisé par le dashboard et la section Réservations.
- `src/components/Reservations/ReservationsSection.tsx` : supprimer le bouton et l'état `syncing`, afficher l'indicateur de dernière synchro.
- L'edge function `sync-google-calendar` reste inchangée (idempotente via `external_id`, aucun doublon possible).
