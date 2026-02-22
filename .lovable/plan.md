

# Creation des tables dans Lovable Cloud

Migration SQL unique pour recreer les 3 tables, 2 fonctions RPC, les politiques RLS et le realtime.

## Tables

### `channels`
- `id` uuid PK (gen_random_uuid)
- `name` text NOT NULL
- `slug` text UNIQUE NOT NULL
- `description` text
- `is_active` boolean DEFAULT true
- `created_at` timestamptz DEFAULT now()

### `channel_stats`
- `id` uuid PK (gen_random_uuid)
- `channel_id` uuid FK -> channels (ON DELETE CASCADE)
- `date` date NOT NULL
- `clicks` integer DEFAULT 0
- `reservations` integer DEFAULT 0
- `total_covers` integer DEFAULT 0
- `created_at` timestamptz DEFAULT now()
- Contrainte UNIQUE sur (channel_id, date)

### `reservations`
- `id` uuid PK (gen_random_uuid)
- `channel_id` uuid FK -> channels (ON DELETE CASCADE)
- `customer_name` text NOT NULL
- `customer_phone` text NOT NULL
- `customer_email` text
- `reservation_date` date NOT NULL
- `reservation_time` text NOT NULL
- `guests_count` integer NOT NULL DEFAULT 2
- `notes` text
- `status` text DEFAULT 'confirmed'
- `created_at` timestamptz DEFAULT now()

## Fonctions RPC

- **`increment_channel_clicks(channel_slug text)`** : Upsert dans channel_stats pour incrementer les clics du jour
- **`increment_channel_reservation(channel_slug text, covers_count integer)`** : Upsert dans channel_stats pour incrementer reservations et couverts du jour

## Securite

Politiques RLS publiques (SELECT, INSERT, UPDATE) sur les 3 tables car la page de reservation est accessible sans authentification.

## Realtime

Les 3 tables ajoutees a `supabase_realtime` pour les mises a jour en direct du dashboard.

## Resultat

Aucune modification de code necessaire. Le code existant fonctionnera automatiquement une fois les tables creees.

