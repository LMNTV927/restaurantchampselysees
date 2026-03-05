

## Diagnostic : Preview bloqué sur "Chargement..."

### Cause
Le composant `ProtectedRoute` dans `App.tsx` affiche "Chargement..." tant que `loading` est `true` dans le hook `useAuth`. Ce hook attend la réponse de `supabase.auth.getSession()` et `onAuthStateChange`. Si la connexion au backend est lente ou si le preview vient de se recharger après les modifications, cela peut prendre quelques secondes.

### Ce n'est probablement pas un bug
- Aucune erreur dans la console (juste des warnings React Router standard)
- Aucune requête réseau en erreur
- Le code d'authentification est correct : il appelle `getSession()`, met à jour le state, puis `setLoading(false)`

### Solution
1. **Rafraîchir le preview** — Un simple rechargement devrait résoudre le problème. Le preview se stabilisera et redirigera vers `/login` (si pas connecté) ou affichera le dashboard (si connecté).

2. **Si le problème persiste** — Ajouter un timeout de sécurité dans `useAuth.tsx` pour forcer `setLoading(false)` après 5 secondes, évitant un blocage indéfini :

```typescript
// Dans useAuth.tsx, ajouter un useEffect avec timeout
useEffect(() => {
  const timeout = setTimeout(() => {
    if (loading) setLoading(false);
  }, 5000);
  return () => clearTimeout(timeout);
}, [loading]);
```

Aucune modification de code n'est nécessaire si un simple rafraîchissement résout le problème. Voulez-vous que j'ajoute le timeout de sécurité ?

