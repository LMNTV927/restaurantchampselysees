# Ajouter la liste des clients aux rapports Trimestre / 6 mois / 1 an

## Constat
Le rapport mensuel contient une page « Détail des réservations » (Client, Téléphone, Email, Date, Heure, Couverts, Statut, Canal). Le rapport par période ne l'a pas, alors que les réservations de chaque mois sont déjà chargées pour le générer.

## Changement
Dans le rapport par période (`generatePeriodReport` de `src/hooks/usePDFReport.ts`), ajouter à la fin la même page « Détail des réservations » que le mensuel :
- mêmes colonnes et même style noir/or ;
- toutes les réservations de la période (pas de limite à 50 : sur 1 an il y en aura des milliers, le tableau s'étend automatiquement sur plusieurs pages) ;
- triées par date de venue puis heure ;
- titre « X réservations enregistrées pour Trimestre (… - …) ».

Le rapport mensuel, les totaux et les autres pages ne changent pas.

## Vérification
Générer les 3 rapports et contrôler que la page contact apparaît avec le bon nombre de lignes.
