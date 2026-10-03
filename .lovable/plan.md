# Plan — Données : mois automatique + rapports trimestre / 6 mois / 1 an

## 1. Bascule automatique au nouveau mois

Déjà en place depuis la dernière correction : la partie Données calcule le mois courant en heure de Paris (`getCurrentMonthInParis()`) et génère la liste des 12 derniers mois automatiquement. Au 1er novembre, le sélecteur affichera « Novembre 2026 » par défaut, sans intervention.

Action restante : vérifier à l'écran que le comportement est correct et le confirmer. Aucun changement de code prévu sur ce point.

## 2. Rapports multi-périodes (PDF)

Aujourd'hui : un bouton « Rapport PDF » qui exporte uniquement le mois sélectionné, et un export CSV du mois.

Ajout d'un sélecteur de période à côté du bouton PDF, avec 4 choix :
- **Mois sélectionné** (comportement actuel, inchangé)
- **Trimestre** (les 3 derniers mois, incluant le mois sélectionné)
- **6 mois** (les 6 derniers mois)
- **1 an** (les 12 derniers mois)

Contenu du rapport multi-périodes :
- Page de synthèse : période couverte, totaux (clics, réservations, couverts, taux de conversion).
- Tableau par mois : chaque mois de la période avec ses réservations, couverts et clics.
- Tableau par canal : répartition des réservations et couverts par canal sur toute la période (avec le découpage Google Ads Search / PMax déjà en place).
- Même style sobre noir et or que le rapport mensuel existant.

L'export CSV reste tel quel (mois sélectionné uniquement).

## 3. Correction au passage

`usePDFReport.ts` contient des noms de mois écrits en dur pour l'année en cours uniquement : un rapport sur un mois d'une autre année afficherait un mauvais libellé. Remplacement par un formatage automatique (nom du mois en français + année), comme déjà fait dans la partie Données.

## Détails techniques

- `src/hooks/usePDFReport.ts` : nouvelle fonction `generatePeriodReport(channels, kpis, periodLabel, monthlyBreakdown, reservations)` ; formatage des mois via `Intl.DateTimeFormat('fr-FR')` au lieu du tableau en dur.
- `src/hooks/useMonthlyData.ts` : réutilisé tel quel — le rapport multi-périodes charge les mois de la période via ce hook existant (ou une variante par plage si plus simple).
- `src/components/Data/DataSection.tsx` : ajout du sélecteur de période (composant `Select` déjà utilisé) à côté du bouton PDF ; aucune autre modification visuelle.
- Aucune migration, aucune nouvelle table, aucune nouvelle dépendance (jsPDF et jspdf-autotable déjà installés).
- Libellés en français, arrondis entiers comme partout dans le dashboard.

## Vérification

- Compilation sans erreur.
- Test navigateur : ouverture de l'onglet Données, génération d'un rapport trimestre et vérification que le PDF se télécharge avec les bons totaux.
