

## Plan : Rendre les réponses de l'Assistant IA plus brèves

### Changement

Modifier le system prompt dans `supabase/functions/ai-assistant/index.ts` (lignes 105-112) pour ajouter des instructions de concision :

- Ajouter : "Sois **bref et concis**. Va droit à l'essentiel."
- Ajouter : "Limite tes réponses à 3-5 points maximum sauf si on te demande plus de détails."
- Modifier l'instruction proactive pour ne suggérer qu'1-2 pistes max au lieu d'être systématiquement exhaustif.
- Ajouter : "Évite les longues introductions et conclusions."

### Fichier modifié
- `supabase/functions/ai-assistant/index.ts` — section `=== INSTRUCTIONS ===` du system prompt
- Redéploiement de la edge function

