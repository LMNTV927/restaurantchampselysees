# Les modifications de réservation ne doivent plus être annulées

## Cause (vérifiée dans le code)
Toutes les 5 minutes, la relève automatique de la boîte Yahoo relit les mails OpenTable et TheFork des derniers jours. Quand elle retrouve une réservation déjà connue, elle **réécrit** la date, l'heure, le nombre de personnes, le nom, le téléphone, l'e-mail et le statut avec les valeurs du mail d'origine. Toute modification faite dans le dashboard est donc effacée quelques minutes plus tard. Le statut « Présent »/« Absent » peut aussi revenir à « Confirmé » de la même façon.

## Correction
Pour une réservation OpenTable/TheFork déjà présente :
- Ne plus toucher à la date, l'heure, les personnes, le nom, le téléphone, l'e-mail ni le commentaire.
- Seule exception : si le mail est une **annulation**, passer la réservation en « Annulée » (sauf si elle est déjà marquée Présent/Absent).
- Les nouvelles réservations continuent d'être importées normalement.

Rien ne change à l'écran.

## Détails techniques
- `supabase/functions/sync-yahoo-opentable/index.ts` : branches `existing` OpenTable et TheFork → patch réduit à `{ status: "cancelled" }` uniquement si `parsed.cancelled` et statut actuel ∉ (show, no_show) ; sinon aucun update (compté dans `skipped`/`kept`).
- `supabase/functions/ingest-opentable-email/index.ts` : même règle.
- Redéploiement des deux fonctions, puis test : modifier une réservation OpenTable, lancer la relève, vérifier que la modification reste.
