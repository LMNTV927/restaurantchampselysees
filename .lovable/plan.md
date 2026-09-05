# Réservations passées : chiffres et affichage complets

## Le problème constaté

Dans l'onglet **Réservations passées**, l'écran affiche « 5 réservations • 18 couverts ».
En réalité la base contient **282 réservations passées pour 1 145 couverts**.

Deux causes :

1. Les deux compteurs (réservations et couverts) sont calculés sur la liste **affichée à l'écran**, qui est limitée à 5 éléments — pas sur l'ensemble des réservations passées.
2. La grille de pages a été retirée au profit du sélecteur de jour, mais la liste reste découpée par tranches de 5 : sans boutons de navigation, il est impossible de voir au-delà des 5 premières.

## Ce qui va changer

- Les compteurs « Réservations Passées » et « Couverts Passés » afficheront le **total réel** :
  - sans jour sélectionné : tout l'historique (282 / 1 145 aujourd'hui) ;
  - avec un jour sélectionné : uniquement ce jour-là.
- La liste affichera les 20 réservations les plus récentes avec un bouton **« Afficher plus »** en bas, qui charge 20 de plus à chaque clic. Plus de grille de numéros de pages.
- Quand un jour est choisi, toutes les réservations de ce jour s'affichent d'un coup.
- Le sélecteur de jour et le bouton « Tout voir » restent tels quels dans la troisième carte.

## Détail technique

Fichier concerné : `src/components/Reservations/ReservationsSection.tsx`

- Extraire le calcul de la liste passée complète (filtrée par jour si défini, triée date/heure décroissantes) dans une valeur unique, réutilisée à la fois pour les KPI et pour l'affichage.
- Les KPI du filtre `past` utilisent la longueur et la somme des `guestsCount` de cette liste complète, au lieu de la tranche affichée.
- Remplacer la pagination par tranches (`currentPage` / `ITEMS_PER_PAGE`) par un `visibleCount` (20 par défaut, +20 par clic), remis à 20 au changement d'onglet ou de jour.
- Supprimer les états et le code de pagination devenus inutiles (`currentPage`, `totalPages`, `getTotalPastReservations`).
- Vérification après coup : ouvrir l'onglet dans le navigateur et confirmer que les compteurs correspondent au total en base, avec et sans jour sélectionné.
