# Lire automatiquement la boîte Yahoo et importer les réservations OpenTable

Oui, c'est possible — et c'est plus simple que la redirection d'e-mails : le logiciel se connecte directement à votre boîte Yahoo, lit les nouveaux messages OpenTable, et une IA en extrait les informations de réservation.

## Comment ça marchera

1. Vous générez dans Yahoo un « mot de passe d'application » (Yahoo → Sécurité du compte → Mots de passe d'application). C'est un code dédié qui donne un accès lecture à la boîte sans exposer votre vrai mot de passe.
2. Ce code est enregistré comme secret dans le backend (jamais visible dans l'application).
3. Une fonction serveur se connecte à la boîte Yahoo, cherche les e-mails non traités provenant d'OpenTable, et récupère leur contenu.
4. Chaque e-mail est envoyé à l'IA, qui renvoie les champs structurés : nom du client, date, heure, nombre de couverts, téléphone, e-mail, occasion/notes, numéro de réservation OpenTable, et s'il s'agit d'une annulation.
5. La réservation est créée (ou mise à jour si le numéro OpenTable existe déjà) avec la source « OpenTable », et apparaît immédiatement dans la page Réservations avec la mention « Via OpenTable ».
6. Aucun e-mail ni SMS n'est envoyé au client pour ces imports (OpenTable l'a déjà fait). L'alerte SMS grande réservation reste active si vous le souhaitez.

## Déclenchement

Conformément à votre contrainte « pas de tâche planifiée en base », la lecture se déclenche :
- automatiquement à l'ouverture du dashboard, au maximum une fois toutes les 5 minutes ;
- manuellement via un bouton « Relever les e-mails OpenTable » à côté du bouton d'import existant, réservé aux admins.

L'import manuel par copier-coller reste disponible en secours.

## Sécurité et fiabilité

- Le mot de passe d'application Yahoo est stocké côté serveur uniquement.
- Chaque e-mail traité est mémorisé (identifiant du message) pour ne jamais créer de doublon, même si la boîte est relue.
- Les e-mails non reconnus sont journalisés sans bloquer les autres.

## Détails techniques

- Secrets à ajouter : `YAHOO_IMAP_USER` (adresse complète) et `YAHOO_APP_PASSWORD`.
- Nouvelle table `email_ingest_log` (`message_id` unique, `status`, `error`, `created_at`) avec RLS + GRANT (lecture admin, écriture service_role) pour l'idempotence et le diagnostic.
- Nouvelle Edge Function `poll-yahoo-opentable` : connexion IMAP TLS à `imap.mail.yahoo.com:993` via `npm:imapflow`, recherche des messages récents dont l'expéditeur contient `opentable`, extraction texte/HTML.
- Extraction par IA via Lovable AI Gateway (`google/gemini-2.5-flash`, sortie JSON structurée) ; repli sur le parser existant `_shared/opentable-parser.ts` si l'IA échoue.
- Upsert dans `reservations` avec `source = 'OpenTable'`, `external_id` = numéro OpenTable (sinon clé nom+date+heure), rattaché au canal `opentable` existant.
- Frontend : hook `useOpenTableAutoSync` calqué sur `useGoogleCalendarAutoSync`, bouton de relève dans `ReservationsSection`, invalidation des caches React Query.
- Étape de validation : après déploiement, un test sur un vrai e-mail OpenTable de votre boîte pour vérifier l'extraction ; ajustement du prompt si besoin.

## Prérequis de votre part

- Générer le mot de passe d'application Yahoo et me le transmettre via le formulaire sécurisé de secrets.
- Vérifier qu'IMAP est activé sur le compte Yahoo (actif par défaut).
