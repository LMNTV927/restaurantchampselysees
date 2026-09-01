# Plan : intégrer automatiquement les réservations OpenTable

## Objectif
Faire en sorte que les notifications de réservation OpenTable reçues sur Yahoo arrivent automatiquement dans le dashboard, avec la source "OpenTable".

## État actuel vérifié
- Le canal **OPENTABLE** (`slug: opentable`) existe déjà en base.
- La Edge Function `ingest-opentable-email` existe mais **n'est pas déployée** (404 au test).
- Le secret `OPENTABLE_INGEST_TOKEN` est configuré.
- Aucun domaine d'email n'est configuré pour recevoir des emails entrants, mais le projet possède le domaine personnalisé `xn--rservation-prince-palace-bfc.fr`.

## Étapes

1. **Activer la réception d'emails entrants sur le domaine personnalisé**
   - Configurer le domaine pour l'email via l'interface Lovable (Cloud → Emails).
   - Ajouter les enregistrements DNS demandés.
   - Créer une adresse dédiée, par exemple `opentable@xn--rservation-prince-palace-bfc.fr`.

2. **Déployer la Edge Function `ingest-opentable-email`**
   - Publier la fonction sur Lovable Cloud afin qu'elle soit accessible.

3. **Relier l'adresse entrante à la Edge Function**
   - Configurer la route entrante pour que les emails reçus sur `opentable@...` soient transmis à la fonction `ingest-opentable-email` avec le token d'ingestion.

4. **Paramétrer le transfert automatique dans Yahoo Mail**
   - Activer le transfert automatique des emails OpenTable vers `opentable@xn--rservation-prince-palace-bfc.fr`.
   - Ou créer un filtre Yahoo dédié aux expéditeurs OpenTable pour ne transférer que ces emails.

5. **(Recommandé) Ajouter une aide dans le dashboard admin**
   - Afficher l'URL du webhook et le token.
   - Ajouter un formulaire de secours manuel : coller le texte/html d'un email OpenTable pour créer la réservation si le transfert automatique échoue.

6. **Tester l'intégration**
   - Envoyer un email de notification OpenTable de test.
   - Vérifier dans le dashboard que la réservation apparaît avec la source **OpenTable**.
   - Ajuster le parser si des champs ne sont pas extraits correctement.

## Après le déploiement
- Seules les **créations** de réservations seront importées (pas les annulations/modifications, selon ta demande).
- Les réservations OpenTable s'afficheront comme "Via OpenTable" dans le dashboard.

## Prérequis de ta part
- Pouvoir modifier les DNS du domaine `xn--rservation-prince-palace-bfc.fr`.
- Avoir accès aux paramètres de transfert de la boîte Yahoo.
