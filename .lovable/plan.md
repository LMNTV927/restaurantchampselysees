# Aucune réservation ne doit être perdue avec le rush de novembre/décembre

## Ce qui est déjà bon
- La liste des réservations, la fiche client, « Clients », les Données et les rapports PDF chargent déjà tout, sans limite (correctif précédent).
- Les nouvelles réservations arrivent en direct à l'écran, même à la minute près.

## Ce qui risque encore de bloquer à 1 000
Il reste des endroits qui lisent les réservations en une seule fois, donc plafonnés à 1 000 lignes. Avec 2 000 à 3 000 couverts par mois, certains vont dépasser :

1. **Nettoyage des doublons** (automatique) : lit toutes les réservations à venir. Au-delà de 1 000, certaines ne seraient plus vérifiées → risque de doublons visibles. Le plus urgent.
2. **E-mail de remerciement après la visite** : lit toutes les réservations passées pas encore remerciées → certains clients ne recevraient pas l'e-mail.
3. **Performance par canal / camembert du mois** : en décembre, le mois peut dépasser 1 000 réservations → chiffres faussés.
4. **Courbe du mois du Dashboard** : même risque en décembre.
5. **Assistant IA** : lit 90 jours → réponses incomplètes.
6. **Rappels SMS, « Réservations prises », jour choisi, 7 prochains jours** : petites fenêtres (1 à 7 jours), mais je les protège aussi par sécurité.

## Correction
Utiliser partout la même méthode de chargement par paquets (déjà testée sur 1 022 réservations), côté écran et côté fonctions automatiques.

## Vérification
- Test automatique avec 3 500 réservations simulées : tout doit être chargé.
- Contrôle en base : nombre réel par mois (novembre, décembre) comparé à ce qu'affichent Données, Dashboard et la liste.
- Lancer le nettoyage des doublons et vérifier qu'il voit bien toutes les réservations à venir.

## Détails techniques
- Front : `useRealtimeChannelsData`, `useRealtimeDashboard`, `useReservationsTaken`, `useUpcomingReservations` → `fetchAllRows` avec `.order('id')` stable.
- Fonctions : ajouter `supabase/functions/_shared/fetchAll.ts` (boucle `.range()` par 1 000) et l'utiliser dans `dedupe-reservations`, `send-followup-thankyou`, `send-reservation-reminder`, `ai-assistant`, `send-reservation-reminder`; redéployer.
- Vérifier aussi `channel_stats` (lignes par jour × canal) avec la même pagination.
- Aucun changement de base, ni d'interface.
