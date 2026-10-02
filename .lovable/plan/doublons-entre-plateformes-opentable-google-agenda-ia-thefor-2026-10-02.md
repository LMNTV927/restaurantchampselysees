# Doublons entre plateformes (OpenTable, Google Agenda/IA, TheFork, site)

## Constat (vérifié en base)
Client +33 6 24 25 28 08, le 02/10 à 22h30 : 3 réservations visibles
- OpenTable « Djarietou Coulibaly » (8 pers.), créée le 30/09, avec le commentaire « Pas de réponse pour le moment »
- IA « Jarilletou » et IA « Jaritou » (9 pers.), créées le 02/10, sans commentaire

Le détecteur compare déjà toutes les plateformes (même numéro, même jour, moins de 3 h d'écart). Mais une réservation avec commentaire n'est jamais masquée : l'OpenTable reste visible à côté de la plus récente.

## Correction
Règle unique : dans un groupe de doublons, on garde **toujours la dernière réservation faite**, quelle que soit la plateforme.
- Les autres sont masquées (consultables et restaurables dans « Doublons »), même si elles ont un commentaire.
- Aucun commentaire perdu : avant de masquer, le commentaire est recopié sur la réservation conservée (ajouté à la suite s'il y en a déjà un).

Pour l'exemple : on garde « Jaritou » (IA, la plus récente), qui reçoit le commentaire « Pas de réponse pour le moment » ; l'OpenTable et « Jarilletou » sont masquées.

Inchangé : aucune suppression, « Restaurer » reste définitif, critères (téléphone 9 chiffres, même jour, moins de 3 h), annulées exclues, aucune modification visible de l'écran.

## Technique
- `supabase/functions/dedupe-reservations/index.ts` : retirer l'exception « ligne commentée jamais masquée » et l'auto-restauration des lignes commentées masquées ; activer la fusion des notes vers `keep` (déjà codée) avant le masquage.
- Redéploiement, lancement immédiat, vérification en base (2 lignes masquées, commentaire présent sur « Jaritou »).
