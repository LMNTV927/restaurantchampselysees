# Doublons entre plateformes (OpenTable, Google Agenda/IA, TheFork, site)

## Constat (vérifié en base)
Client +33 6 24 25 28 08, le 02/10 à 22h30 : 3 réservations visibles
- OpenTable « Djarietou Coulibaly » (8 pers.) avec le commentaire « Pas de réponse pour le moment »
- IA « Jarilletou » et IA « Jaritou » (9 pers.), sans commentaire, créées le 02/10

Le détecteur compare déjà toutes les plateformes (même numéro, même jour, moins de 3 h d'écart). Mais il garde toujours la plus récente, et une réservation avec commentaire n'est jamais masquée : résultat, l'OpenTable commentée reste ET une IA reste aussi.

## Correction
Dans le détecteur de doublons, choix de la réservation à conserver dans un groupe :
1. S'il y a une réservation avec commentaire : on garde celle-là (la plus récente des commentées).
2. Sinon : on garde la plus récente (comportement actuel).
3. Les autres, sans commentaire, sont masquées (consultables et restaurables dans « Doublons », comme aujourd'hui).

Pour l'exemple : on garde l'OpenTable commentée, les deux IA sont masquées.

Inchangé : aucune suppression, aucun commentaire perdu, « Restaurer » reste définitif, critères (téléphone 9 chiffres, même jour, moins de 3 h), annulées exclues, aucune modification visible de l'écran.

Si deux réservations ont chacune un commentaire, elles restent toutes les deux visibles (on ne masque jamais un commentaire).

## Technique
- `supabase/functions/dedupe-reservations/index.ts` : dans `handleCluster`, `keep` = la plus récente parmi les lignes avec `notes` non vides, sinon la plus récente du groupe.
- Redéploiement puis lancement immédiat, vérification en base que les 2 lignes IA sont `is_duplicate = true`.
