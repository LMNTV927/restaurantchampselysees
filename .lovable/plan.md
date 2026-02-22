# Synchronisation Google Agenda vers le Dashboard

## Vue d'ensemble

Creer une synchronisation automatique qui importe les evenements de votre Google Agenda comme reservations externes dans votre dashboard. Les evenements seront recuperes toutes les 10 minutes via une tache planifiee.

## Comment ca marche

1. Une fonction backend lit votre Google Agenda via l'API Google Calendar
2. Elle extrait le nom du client (titre), la date, l'heure, et les details (description)
3. Les reservations sont inserees dans la base de donnees avec un marqueur "source externe"
4. Un cron job execute cette fonction toutes les 5 minutes
5. Le dashboard affiche ces reservations avec un badge "Google Agenda" pour les distinguer

## Pre-requis cote Google

Vous devrez creer un **compte de service Google** (gratuit) :

1. Aller sur Google Cloud Console
2. Creer un projet (ou utiliser un existant)
3. Activer l'API Google Calendar
4. Creer un compte de service et telecharger la cle JSON
5. Partager votre agenda avec l'email du compte de service

## Etapes d'implementation

### 1. Ajouter une colonne source aux reservations

- Ajouter `source` (text, nullable, default null) a la table `reservations` pour distinguer les reservations manuelles des externes
- Ajouter `external_id` (text, nullable, unique) pour eviter les doublons lors des re-syncs

### 2. Creer la fonction backend `sync-google-calendar`

- Lit les evenements Google Calendar via l'API REST
- Parse le titre (nom du client) et la description (couverts, telephone)
- Format attendu de la description : lignes contenant "Couverts: X", "Tel: 06...", "Notes: ..."
- Upsert dans la table reservations avec `external_id` = event ID Google
- Source = "Google Agenda"

### 3. Configurer le cron job

- Executer `sync-google-calendar` toutes les 5 minutes via pg_cron
- La fonction ne re-cree pas les reservations existantes (upsert sur external_id)

### 4. Adapter l'affichage dans le dashboard

- Afficher un badge "Google Agenda" sur les reservations importees
- Distinguer visuellement les reservations externes des reservations internes

### 5. Ajouter un bouton de sync manuelle

- Bouton "Synchroniser" dans la section reservations pour forcer un rafraichissement immediat

## Details techniques

### Format attendu des evenements Google Agenda

- **Titre** : Nom du client (ex: "Dupont Martin")
- **Date/Heure** : Date et heure de debut de l'evenement
- **Description** (optionnelle, format libre avec extraction intelligente) :
  ```
  Couverts: 4
  Tel: 0612345678
  Notes: Anniversaire, table pres de la fenetre
  ```

### Secrets necessaires

- `GOOGLE_CALENDAR_ID` : l'ID de votre agenda (souvent votre email)
- `GOOGLE_SERVICE_ACCOUNT_KEY` : la cle JSON du compte de service

### Schema de la migration

```text
ALTER TABLE reservations
  ADD COLUMN source text DEFAULT null,
  ADD COLUMN external_id text UNIQUE DEFAULT null;
```

### Logique de sync (edge function)

```text
1. Fetch events from Google Calendar API (today + 30 days)
2. For each event:
   a. Parse title -> customer_name
   b. Parse start time -> reservation_date, reservation_time
   c. Parse description -> guests_count, phone, notes
   d. Upsert into reservations WHERE external_id = event.id
3. Return count of synced reservations
```

## Resultat attendu

- Les reservations de votre Google Agenda apparaissent automatiquement dans le dashboard
- Badge "Google Agenda" visible pour les differencier
- Aucune duplication grace au systeme d'external_id
- Sync toutes les 5 minutes + bouton manuel