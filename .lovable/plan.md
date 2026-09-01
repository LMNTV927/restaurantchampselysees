# Centraliser les réservations OpenTable et Google Agenda

Objectif : voir toutes les réservations au même endroit, avec un badge d'origine (« via OPENTABLE », « via GOOGLE AGENDA ») dans la liste existante.

## 1. Deux nouveaux canaux

Ajout de deux canaux dans la base : `OPENTABLE` et `GOOGLE AGENDA`. Ils permettent de rattacher les réservations importées et de les compter dans les statistiques par canal, comme les autres sources.

## 2. OpenTable — via les e-mails de notification

Vous configurez une redirection automatique des e-mails OpenTable vers une adresse dédiée. Chaque e-mail reçu est analysé et transformé en réservation.

Fonctionnement :
- Une fonction serveur reçoit l'e-mail redirigé (webhook de réception).
- Elle extrait : nom du client, date, heure, nombre de couverts, téléphone/e-mail si présents, et l'identifiant de réservation OpenTable.
- Elle crée la réservation avec la source « OpenTable ». Si l'identifiant existe déjà, elle met à jour au lieu de dupliquer.
- Les e-mails d'annulation/modification OpenTable mettent à jour la réservation existante.
- Aucun e-mail ni SMS de confirmation n'est envoyé au client pour ces imports (OpenTable l'a déjà fait).
- Les e-mails non reconnus sont ignorés et journalisés pour qu'on puisse ajuster l'analyse.

Point à valider ensemble à la mise en route : je vous demanderai de me transmettre un exemple réel d'e-mail OpenTable (copier-coller) pour caler précisément l'extraction — les formats varient selon la langue et le type de notification.

## 3. Google Agenda — lecture seule

Import des événements de l'agenda de l'établissement comme réservations. Rien n'est écrit dans Google Agenda.

Fonctionnement :
- Une fonction serveur lit les événements à venir (jusqu'à 60 jours) avec le compte de service déjà configuré.
- Titre de l'événement → nom du client ; heure de début → heure ; nombre de couverts détecté dans le titre ou la description (ex. « Dupont – 6 pers »), sinon 2 par défaut.
- Source « Google Agenda », identifiant de l'événement conservé pour éviter les doublons ; un événement supprimé ou déplacé met à jour la réservation existante.
- Déclenchement à l'ouverture du dashboard (max une fois par heure) et via un bouton « Synchroniser » — pas de tâche planifiée en base, conformément à vos contraintes.

## 4. Affichage

- Les réservations importées apparaissent dans les mêmes listes et onglets, triées par date/heure, avec le badge d'origine déjà en place.
- Elles comptent dans les KPI (réservations, couverts, occupation) et dans les statistiques par canal.
- Un petit indicateur « importé » (non modifiable côté client) sur la fiche, mais les actions Présent/Absent, notes et suppression restent disponibles.

## Détails techniques

- Migration : insertion des canaux `opentable` et `google-agenda` ; index unique sur `(source, external_id)` pour l'idempotence des imports.
- Edge function `ingest-opentable-email` (publique, protégée par un jeton secret dans l'URL) : parse HTML/texte de l'e-mail, upsert dans `reservations` avec `source = 'OpenTable'` et `external_id = <n° résa OpenTable>`.
- Réception des e-mails : Resend Inbound sur un sous-domaine dédié (clé Resend déjà présente), ou redirection depuis la boîte de l'établissement vers l'adresse d'ingestion.
- Edge function `sync-google-calendar` : JWT service account (`GOOGLE_SERVICE_ACCOUNT_KEY`) → `calendar/v3/calendars/{GOOGLE_CALENDAR_ID}/events` en lecture seule (`timeMin`/`timeMax`), upsert avec `external_id = event.id`. Les deux secrets nécessaires existent déjà.
- Frontend : bouton de synchronisation dans la section Réservations, invalidation des caches React Query existants ; aucun changement du rendu des heures (chaînes stockées telles quelles).
- L'affichage du badge utilise déjà `source || channelName` — rien à modifier.
