# Vérification complète des calculs + corrections

## Déjà vérifié (base de données vs code)

- **Onglet Données et rapports PDF : justes.** Recalcul direct en base (réservations par date de venue, hors doublons, hors annulées) :
  - Trimestre août–oct : 92 + 183 + 54 = 329 réservations, 309 + 589 + 293 = 1 191 couverts — identique au rapport.
  - 6 mois : 428 réservations — identique. 1 an : 458 — identique.
- Aucune réservation sans statut en base (pas de cas oublié).

## Erreur trouvée

**Dashboard (cartes du jour, évolution vs hier, courbe du mois) : les réservations annulées sont comptées.** Les chiffres « Réservations », « Couverts », « Taux d'occupation » et le graphique du mois sont donc gonflés dès qu'un client annule, alors que l'onglet Données les exclut. Les deux pages ne donnent pas le même total pour un même jour.

## Point à contrôler

- Octobre est passé de 54 à 87 réservations valides depuis le dernier rapport. Je vérifierai que cette hausse vient bien de nouvelles réservations (OpenTable, TheFork, liens) et non d'un doublon d'import.

## Plan de correction et triple vérification

1. **Dashboard** : exclure les annulées des 3 calculs (aujourd'hui, hier, mois en cours), comme dans l'onglet Données.
2. **Vérification 1 — base** : recompter chaque mois en base, et contrôler les doublons d'import (même téléphone + même jour + même source).
3. **Vérification 2 — écran** : ouvrir Dashboard, Données (Mois / Trimestre / 6 mois / 1 an), Liens, Clients, fiche client, et comparer chaque chiffre à la base : réservations, couverts, clics, conversion (plafonnée à 100 %), occupation sur 500 places, pourcentages arrondis.
4. **Vérification 3 — croisée** : rapports PDF et CSV = écran = base ; somme du camembert et du tableau par canal = total KPI ; Search + PMax = total Google Ads ; onglets Aujourd'hui / 7 jours / À venir sans doublon.
5. Toute autre erreur découverte pendant ces contrôles est corrigée dans la foulée, puis compte rendu chiffré.

## Ce qui ne change pas
Aucun changement visuel, aucune suppression, aucune modification de la base. Le bloc « Réservations prises » reste basé sur la date d'enregistrement.

## Détails techniques
- `src/hooks/useRealtimeDashboard.ts` : ajouter `.neq('status', 'cancelled')` aux 3 requêtes `reservations`.
