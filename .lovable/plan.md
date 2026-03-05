

## Diagnostic

Le chargement infini vient du hook `useAuth.tsx`. La fonction `fetchRole()` appelle `supabase.rpc("get_user_role")` **sans try/catch**. Si cet appel échoue (erreur réseau, permission RLS, etc.), l'exception empêche `setLoading(false)` de s'exécuter, et l'app reste bloquée sur "Chargement..." indéfiniment.

## Correction

**Fichier : `src/hooks/useAuth.tsx`**

Entourer `fetchRole` d'un try/catch pour que `setLoading(false)` soit toujours appelé, même en cas d'erreur :

```typescript
const fetchRole = async (userId: string) => {
  try {
    const { data } = await supabase.rpc("get_user_role", { _user_id: userId });
    setRole(data as string | null);
  } catch (error) {
    console.error("Error fetching role:", error);
    setRole(null);
  }
};
```

De plus, ajouter un try/catch dans les deux blocs (`onAuthStateChange` et `getSession`) pour garantir que `setLoading(false)` s'exécute dans tous les cas, en utilisant un pattern `finally`.

