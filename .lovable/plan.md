

## Plan : Ajouter une route de prévisualisation du mail de remerciement

Je vais simplement ajouter une route `/email-preview-thankyou` qui reproduit le template HTML exact du mail de remerciement (celui envoyé 3h après la réservation), avec des données de test. Même approche que `/email-preview` qui existe déjà pour le mail de confirmation.

### Fichiers modifiés

1. **`src/pages/ThankYouEmailPreviewPage.tsx`** (nouveau) — Reproduit en React le même HTML que `buildThankYouEmailHtml()` dans l'Edge Function, avec le nom test "Jean Dupont". Inclut : logo, étoile, message de remerciement, bouton Google, footer réseaux sociaux.

2. **`src/App.tsx`** — Ajout de la route `/email-preview-thankyou` (publique, pas protégée).

### Accès

Vous pourrez voir le rendu en allant sur `/email-preview-thankyou` dans le navigateur et me dire les corrections à apporter.

