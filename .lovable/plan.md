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
- Le résumé au-dessus de la liste (« X réservations • Y couverts ») utilisera les mêmes totaux complets et restera cohérent avec les deux cartes.
- Sans jour sélectionné, aucune liste partielle ne sera affichée : l'écran invitera à choisir un jour afin d'éviter de donner l'impression que seules 5 réservations existent.
- Quand un jour est choisi, toutes les réservations de ce jour s'affichent d'un coup.
- Le sélecteur de jour et le bouton « Tout voir » restent tels quels dans la troisième carte.

## Détail technique

Fichier concerné : `src/components/Reservations/ReservationsSection.tsx`

- Extraire le calcul de la liste passée complète (filtrée par jour si défini, triée date/heure décroissantes) dans une valeur unique, réutilisée à la fois pour les KPI et pour l'affichage.
- Les deux KPI et le résumé de la liste du filtre `past` utilisent la longueur et la somme des `guestsCount` de cette liste complète, au lieu de la tranche affichée.
- Supprimer la pagination par tranches et n'afficher la liste passée que lorsqu'une date précise est sélectionnée.
- Supprimer les états et le code de pagination devenus inutiles (`currentPage`, `ITEMS_PER_PAGE`, `totalPages`, `getTotalPastReservations`).
- Vérification après coup : ouvrir l'onglet dans le navigateur et confirmer que les compteurs correspondent au total en base, avec et sans jour sélectionné.
