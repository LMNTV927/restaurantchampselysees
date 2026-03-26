

## Plan : Email de remerciement automatique 3h après la réservation

### Concept

Une Edge Function `send-followup-thankyou` vérifie toutes les heures les réservations confirmées dont l'heure est passée depuis 3h. Elle envoie uniquement un **email** de remerciement avec un lien vers la fiche Google pour laisser un avis. Pas de SMS.

**Contrainte** : pg_cron a été refusé précédemment. L'alternative est de déclencher la vérification depuis le dashboard (à chaque chargement) ou d'utiliser un service cron externe gratuit (comme cron-job.org) qui appelle la fonction toutes les heures.

### Étapes

1. **Migration SQL** : Ajouter colonne `followup_sent` (boolean, default false) à la table `reservations`

2. **Nouvelle Edge Function `send-followup-thankyou`** :
   - Cherche les réservations où `status = 'confirmed'`, `followup_sent = false`, et date+heure + 3h < maintenant (timezone Europe/Paris)
   - Envoie un **email** via Resend : template noir/or Prince Palace avec remerciement + bouton "Laisser un avis sur Google"
   - Met à jour `followup_sent = true`
   - Copie à `princepalace.champselysees@gmail.com`

3. **Template email de remerciement** : Design cohérent avec les emails existants (noir/or, logo, réseaux sociaux Instagram/Facebook/TikTok)

4. **Déclenchement automatique** : Deux options possibles :
   - **Option A** : Appel depuis le dashboard à chaque chargement (simple mais nécessite que quelqu'un ouvre le dashboard)
   - **Option B** : Service cron externe gratuit (cron-job.org) qui appelle l'URL de la fonction toutes les heures (fiable, autonome)

### Fichiers

- Migration SQL : ajout colonne `followup_sent`
- `supabase/functions/send-followup-thankyou/index.ts` (nouveau)
- Template email remerciement dans la fonction
- `src/hooks/useRealtimeDashboard.ts` ou composant Dashboard (si option A)

### Prérequis

- **Lien Google Avis** à fournir par vous

