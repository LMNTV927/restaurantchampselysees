# Autres traitements automatiques qui annulent des modifications

## Ce que j'ai trouvé (vérifié dans le code)
1. **Synchronisation Google Agenda : même bug.** Elle tourne encore en arrière-plan dès qu'on ouvre le Dashboard ou l'onglet Réservations. Pour chaque réservation venant de l'agenda, elle **réécrit** le nom, la date, l'heure et le nombre de personnes avec ceux de l'agenda. Une modification faite dans le dashboard est donc annulée. Cette synchronisation devait pourtant être supprimée définitivement.
2. **Détection des doublons : risque plus faible.** Si vous changez l'heure d'une réservation et qu'elle se retrouve à moins de 3 h d'une autre réservation du même client le même jour, l'une des deux peut disparaître de la liste. Elle n'est pas supprimée : elle reste dans les doublons et peut être restaurée. Le bouton « Restaurer » est définitif.
3. **OpenTable / TheFork** : corrigé au message précédent.
4. **Modification par le client** (lien du mail) : aucun écrasement automatique, rien à corriger.

## Correction proposée
- Arrêter complètement la synchronisation Google Agenda : plus aucun appel automatique depuis le Dashboard ni depuis l'onglet Réservations. Les réservations déjà importées restent en place.
- Par sécurité, si cette fonction est malgré tout appelée, elle ne modifie plus les réservations existantes. Elle peut seulement passer en « Annulée » une réservation annulée dans l'agenda, sauf si elle est déjà Présent/Absent.
- Doublons : quand une réservation est modifiée à la main, elle n'est plus jamais masquée automatiquement.

Rien ne change à l'écran.

## Détails techniques
- Retirer `useGoogleCalendarAutoSync()` de `useRealtimeDashboard.ts` et `ReservationsSection.tsx`, puis supprimer le hook.
- `sync-google-calendar/index.ts` : branche `existing` → aucun update. Branche `ev.status === "cancelled"` → `.not("status","in","(show,no_show)")`. Redéployer.
- `EditReservationDialog.tsx` : l'update envoie aussi `dedupe_ignored: true`. La fonction de doublons ignore déjà ces lignes.
