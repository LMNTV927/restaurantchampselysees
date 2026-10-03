# Plan : la partie Données affiche les statistiques de la période choisie

## Problème constaté (vérifié dans le code)
Le sélecteur « Mois / Trimestre / 6 mois / 1 an » ne sert aujourd'hui qu'au rapport PDF. Les cartes KPI, les graphiques et le tableau par canal affichent toujours le seul mois sélectionné, quelle que soit la période choisie.

## Objectif
Quand on clique sur « Trimestre », « 6 mois » ou « 1 an », toute la partie Données affiche les statistiques agrégées de cette période (terminant au mois sélectionné). « Mois » garde le comportement actuel.

## Modifications

### 1. Chargement des données de la période
- Nouveau hook `usePeriodData(selectedMonth, period)` dans `src/hooks/useMonthlyData.ts` : charge les mois de la période via `fetchMonthlyData` (déjà existant), en parallèle, avec état de chargement.
- Pour « Mois » : comportement inchangé (données temps réel du mois en cours ou mois passé).

### 2. Agrégation des statistiques (`src/components/Data/DataSection.tsx`)
- **Cartes KPI** : somme des clics, réservations et couverts sur la période ; conversion = réservations / clics agrégés (arrondie, entier). Évolution : comparaison avec la période précédente de même durée (ex. trimestre vs trimestre précédent), « N/A » si pas de données.
- **Tableau par canal + camembert** : agrégation des canaux sur la période (somme clics / réservations / couverts par canal, conversion recalculée).
- **Graphiques en ligne** : en mode multi-mois, l'axe X devient les mois de la période (ex. « Août », « Sept. », « Oct. ») au lieu des jours ; titres adaptés (« Réservations — Trimestre (Août - Octobre 2026) »).
- Règles existantes conservées : réservations annulées et doublons exclus, comptage par date de la réservation.

### 3. Exports alignés
- **Export CSV** : exporte les canaux agrégés de la période affichée (nom de fichier adapté, ex. `prince-palace-trimestre-2026-10.csv`).
- **Rapport PDF** : inchangé, il suit déjà la période choisie.

## Fichiers touchés
- `src/hooks/useMonthlyData.ts` (nouveau hook d'agrégation)
- `src/components/Data/DataSection.tsx` (affichage piloté par la période)

## Vérification
- Compilation sans erreur, puis test navigateur dans le dashboard : bascule Mois → Trimestre → 6 mois → 1 an, contrôle que les KPI, graphiques et tableau changent et que les totaux correspondent aux données réelles.
