

## Plan : Suppression de réservations (admin uniquement)

### Objectif
Permettre aux administrateurs de supprimer définitivement une réservation (suppression physique de la base de données, pas juste un changement de statut). Les serveurs ne verront pas cette option.

### Modifications

**1. Migration base de données** — Ajouter une policy RLS DELETE sur la table `reservations`, limitée aux admins via `has_role()`.

```sql
CREATE POLICY "Admins can delete reservations"
ON public.reservations
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

**2. Hook `useRealtimeReservations.ts`** — Ajouter une fonction `deleteReservation` qui exécute un `DELETE` sur la table reservations et met à jour l'état local.

**3. Composant `ReservationsSection.tsx`** — 
- Importer `useAuth` pour vérifier le rôle
- Ajouter un bouton "Supprimer" (icône poubelle, rouge) visible uniquement si `role === 'admin'`
- Ajouter un dialogue de confirmation (`AlertDialog`) avant suppression
- Au clic, appeler `deleteReservation` puis afficher un toast de confirmation

Le bouton apparaîtra dans la zone d'actions au hover, à côté des boutons Show/No-show/Annuler, et aussi pour les réservations passées.

