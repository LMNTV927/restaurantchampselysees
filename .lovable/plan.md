# Rappels de réservation + détection de doublons

## 1. Rappel de réservation (24h avant)

Objectif : relancer uniquement les clients qui ont réservé bien en avance.

Règles d'envoi :
- La réservation a été créée **plus de 30h avant** l'heure de la réservation (les réservations de dernière minute ne reçoivent rien).
- Il reste **environ 24h ou moins** avant l'heure de la réservation.
- Statut = confirmée, non annulée, non marquée comme doublon.
- Un seul rappel par réservation (marqueur en base).

Contenu :
- **Email** (design Noir & Or, même identité que la confirmation) : rappel du nom, date, heure, nombre de personnes, adresse, plus les liens Modifier / Annuler existants (jeton de modification). Copie à l'établissement.
- **SMS** (Twilio) : version courte avec date, heure, nombre de personnes et lien de gestion.

Déclenchement : sans cron base de données (contrainte projet). Une fonction serveur `send-reservation-reminder` est appelée automatiquement à l'ouverture du dashboard (même mécanisme que les remerciements 3h), et un bouton manuel n'est pas nécessaire.

## 2. Détection de doublons

Critère de doublon : **même numéro de téléphone (normalisé)** + **même date** + horaires proches (**≤ 2h d'écart**).

Traitement :
- On garde **uniquement la réservation créée le plus récemment**.
- Les autres sont **marquées comme doublon** (masquées des listes, KPI, rappels et e-mails) — **aucune suppression**, **aucun message d'annulation envoyé au client**.
- Un filtre « Doublons » réservé aux admins permet de consulter les entrées masquées et de restaurer une entrée en cas d'erreur.

La détection tourne :
- à la création d'une réservation (dashboard, lien public, IA, OpenTable) ;
- lors d'un balayage global au chargement du dashboard, pour nettoyer l'existant.

## Détails techniques

Base de données (migration) :
- `reservations`: ajout de `reminder_sent boolean not null default false`, `is_duplicate boolean not null default false`, `duplicate_of uuid null references reservations(id)`.
- Index sur `(customer_phone, reservation_date)` pour la recherche de doublons.

Fonctions serveur :
- `send-reservation-reminder` : sélectionne les réservations éligibles (created_at ≤ reservation - 30h, reservation dans les prochaines 24h, `reminder_sent = false`, `is_duplicate = false`, statut confirmé), envoie email (Resend) + SMS (Twilio), BCC/copie à princepalace.champselysees@gmail.com, puis passe `reminder_sent = true`.
- `dedupe-reservations` : normalise les téléphones (E.164 FR), regroupe par téléphone + date, compare les heures (≤ 120 min), marque toutes les entrées sauf la plus récente avec `is_duplicate = true` et `duplicate_of`.

Front :
- `useRealtimeReservations` / `useRealtimeDashboard` : filtrer `is_duplicate = false` dans les requêtes et les KPI.
- Appel de `send-reservation-reminder` et `dedupe-reservations` au chargement du dashboard (throttle localStorage, comme le suivi 3h).
- `ReservationsSection` : filtre admin « Doublons » avec action « Restaurer ».
