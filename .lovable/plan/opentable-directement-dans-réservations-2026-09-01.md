# OpenTable directement dans Réservations

Objectif : supprimer l'onglet "Intégrations" et faire apparaître les réservations OpenTable directement dans la page Réservations, comme les autres (Via OpenTable).

## Ce qui existe déjà

- Une fonction serveur qui reçoit les e-mails OpenTable, les analyse et crée/met à jour la réservation dans la base (avec anti-doublon).
- Une fonction d'import manuel qui fait la même chose à partir du contenu d'un e-mail collé.
- Un onglet "Intégrations" séparé qui sert uniquement de mode d'emploi et d'outil de collage.

Donc la brique d'import fonctionne déjà : il ne manque que le rattachement à la page Réservations et la suppression de l'onglet.

## Solution retenue (la plus simple)

1. **Supprimer l'onglet "Intégrations"** : retrait de l'entrée du menu, de la section dans la page principale, et suppression du composant + de la fonction de configuration automatique devenue inutile.
2. **Ajouter un bouton discret "Importer OpenTable"** dans la barre d'actions de la page Réservations (à côté de "Ajouter une réservation", visible pour les administrateurs). Il ouvre une petite fenêtre où l'on colle l'e-mail OpenTable ; à la validation, la réservation apparaît immédiatement dans la liste.
3. **Réception automatique par e-mail** : l'adresse de réception reste active en arrière-plan. Il suffit de mettre en place une règle de transfert automatique des e-mails OpenTable vers cette adresse ; les réservations tombent alors toutes seules dans la page Réservations, sans aucune action.
4. **Affichage** : les réservations importées portent déjà la source "OpenTable", donc elles s'affichent "Via OpenTable" dans la liste, et sont incluses dans les filtres 7 jours / Tout à venir et dans les statistiques du canal OpenTable.

Le bouton d'import manuel sert de filet de sécurité tant que le transfert automatique n'est pas configuré, ou si un e-mail au format inhabituel n'est pas reconnu.

## Détails techniques

- `src/components/Layout/Header.tsx` : retirer l'onglet `integrations`.
- `src/pages/Index.tsx` : retirer l'import et le cas `integrations`.
- Supprimer `src/components/Integrations/IntegrationsSection.tsx` et la fonction `setup-opentable-receiving`.
- Nouveau `src/components/Reservations/ImportOpenTableDialog.tsx` : champ objet + contenu de l'e-mail, appel de la fonction `manual-opentable-import` (déjà protégée par le rôle admin), toast de résultat, puis rafraîchissement de la liste.
- `src/components/Reservations/ReservationsSection.tsx` : afficher ce bouton uniquement si `role === "admin"`, à côté du bouton d'ajout ; réutiliser le callback de rafraîchissement existant.
- `ingest-opentable-email` et le parseur partagé restent inchangés.
