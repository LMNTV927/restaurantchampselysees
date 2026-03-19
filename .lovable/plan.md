

## Plan : Boutons "Modifier" et "Annuler" fonctionnels dans l'email de confirmation

### Concept

Chaque réservation reçoit un token unique sécurisé. Les boutons de l'email pointent vers des pages publiques (`/reservation/modify/{token}` et `/reservation/cancel/{token}`) où le client peut modifier ou annuler sa réservation sans connexion. Après confirmation, il reçoit un nouvel email + SMS avec les informations mises à jour (ou l'annulation).

### Étapes

#### 1. Base de données — Ajouter un token de modification aux réservations

- Migration SQL : ajouter une colonne `modification_token` (UUID, unique, défaut `gen_random_uuid()`) à la table `reservations`
- Mettre à jour les réservations existantes avec un token
- Créer une RLS policy permettant le SELECT et UPDATE publics **uniquement via le token** (pas besoin d'être authentifié)

#### 2. Nouvelle page `/reservation/modify/:token`

- Page publique (même design noir/or que le formulaire de booking existant)
- Au chargement : récupère la réservation via le token
- Affiche les infos actuelles (date, heure, couverts, notes) dans un formulaire pré-rempli modifiable
- Bouton "Confirmer les modifications" → met à jour la réservation en base → déclenche le renvoi de l'email + SMS de confirmation avec les nouvelles infos
- Si token invalide → message d'erreur élégant

#### 3. Nouvelle page `/reservation/cancel/:token`

- Page publique (même design)
- Affiche un récapitulatif de la réservation + demande de confirmation d'annulation
- Bouton "Confirmer l'annulation" → passe le statut à `cancelled` en base
- Envoie un email + SMS d'annulation
- Affiche une confirmation visuelle

#### 4. Mettre à jour l'email template et la preview

- Dans le template React Email (`reservation-confirmation.tsx`) : remplacer les `href="#"` et `href="tel:..."` des boutons Modifier/Annuler par les vraies URLs : `https://palace-pulse.lovable.app/reservation/modify/{token}` et `.../cancel/{token}`
- Passer le `modification_token` comme prop au template
- Mettre à jour la preview (`EmailPreviewPage.tsx`) avec des URLs de test

#### 5. Edge function — Passer le token à l'email

- Dans `send-reservation-confirmation/index.ts` : accepter `modificationToken` dans le body, le passer au template
- Modifier `BookingForm.tsx` : après l'insert, récupérer le `modification_token` généré et le passer à l'edge function

#### 6. Email + SMS de modification/annulation

- Créer une edge function `send-reservation-update` (ou réutiliser `send-reservation-confirmation` avec un paramètre `type: 'modification' | 'cancellation'`)
- Template email adapté : "Réservation modifiée" ou "Réservation annulée" avec les nouvelles infos
- SMS adapté : message confirmant la modification ou l'annulation

#### 7. Routes dans App.tsx

- Ajouter les routes publiques : `/reservation/modify/:token` et `/reservation/cancel/:token`

### Fichiers impactés

- **Migration SQL** : nouvelle colonne + RLS policies
- `src/pages/ModifyReservationPage.tsx` (nouveau)
- `src/pages/CancelReservationPage.tsx` (nouveau)
- `src/App.tsx` (nouvelles routes)
- `supabase/functions/send-reservation-confirmation/index.ts` (accepter token)
- `supabase/functions/send-reservation-confirmation/_templates/reservation-confirmation.tsx` (URLs dynamiques)
- `src/pages/EmailPreviewPage.tsx` (mise à jour preview)
- `src/components/Booking/BookingForm.tsx` (récupérer token après insert)

