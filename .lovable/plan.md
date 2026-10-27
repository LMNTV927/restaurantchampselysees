# Onglet « Réservations passées / futures »

## Ce qui change pour le gérant
- L'onglet « Réservations passées » devient **« Réservations passées / futures »**.
- Le calendrier « Choisir un jour » permet désormais de choisir **n'importe quelle date**, passée ou future (aujourd'hui inclus).
- Choisir une date future affiche exactement la même liste qu'une date passée : mêmes lignes, mêmes boutons (Présent/Absent, fiche client, i, modification), même titre « Réservations du JJ/MM/AAAA » et même résumé réservations · couverts.
- Le bloc séparé « Réservations à venir » ajouté sous la liste (sélecteur de jour + 7 pastilles) est **supprimé**, puisque l'onglet le remplace.
- Les cartes « Réservations ce mois » / « Couverts ce mois » restent identiques (réservations passées du mois). Sans date choisie, le message « Choisissez un jour pour afficher ses réservations » reste affiché.
- Rien d'autre ne bouge : Aujourd'hui, Prochains 7 jours, Tout à venir, Doublons, Dashboard.

## Détails techniques
- `ReservationsSection.tsx` :
  - Libellés de l'onglet `past` et titre → « Réservations passées / futures ».
  - Calendrier : retirer `toDate={new Date()}`.
  - Quand une date est choisie, filtrer toutes les réservations chargées (`realtimeReservations` mappées, doublons déjà exclus) sur `reservationDate === date choisie`, triées par heure, au lieu de la base « passées seulement ». Les KPI du mois continuent d'utiliser `currentMonthPastReservations`.
  - Supprimer le bloc « Réservations à venir » ajouté, ainsi que l'import `useUpcomingReservations`, son state, et les helpers `formatShortDay` / `formatUpcomingTime` s'ils ne servent plus.
- Aucune base, fonction ou autre écran modifié.
