# Réafficher toutes les réservations Google Agenda (IA)

## Constat
- Dernière réservation « IA » importée : 10/10. Depuis, plus rien n'arrive (78 au total, 7 à venir).
- La relève Google Agenda est arrêtée (désactivée pour qu'elle n'annule plus vos modifications). Les nouvelles réservations de l'agenda ne sont donc plus importées.

## Correction
1. Réactiver la relève Google Agenda toutes les 5 minutes quand le dashboard est ouvert, en lecture seule (rien n'est écrit dans l'agenda).
2. Elle ne fait qu'ajouter les nouvelles réservations. Une réservation déjà présente n'est jamais modifiée : date, heure, personnes, nom, commentaire et Présent/Absent restent comme vous les avez laissés (même règle qu'OpenTable/TheFork).
3. Lancer une relève tout de suite pour récupérer les réservations manquantes depuis le 10/10, puis comparer le nombre d'événements de l'agenda avec ce qui s'affiche dans Réservations.

## Détails techniques
- `sync-google-calendar` : retirer la désactivation ; mode insertion seule (si `external_id` existe déjà → ignoré) ; garde staff conservée.
- Hook auto-sync appelé depuis `useRealtimeDashboard` à côté de `useYahooOpenTableAutoSync`.
- Vérification : logs de la fonction + requête comptant les lignes `source = 'IA'`.
