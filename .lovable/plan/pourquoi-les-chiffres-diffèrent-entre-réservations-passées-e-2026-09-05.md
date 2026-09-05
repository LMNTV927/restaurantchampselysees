# Pourquoi les chiffres diffèrent entre « Réservations passées » et « Données & Analytics »

## Ce que j'ai vérifié dans vos données (septembre 2026)

| Source du chiffre | Réservations | Couverts |
|---|---|---|
| Liste des réservations (par date de venue, doublons exclus) | 35 | 198 |
| Compteurs utilisés par Données & Analytics | 18 | 51 |

## Les trois raisons de l'écart

1. **Deux sources différentes.** La page Réservations lit la vraie liste des réservations. La page Données & Analytics ne lit pas cette liste : elle lit un compteur séparé, alimenté uniquement quand quelqu'un réserve via un lien de réservation suivi.

2. **Les réservations saisies à la main, celles venant de « IA » (agenda) et celles d'OpenTable ne sont jamais comptées** dans Données & Analytics. En septembre : 5 réservations « IA » (40 couverts) et 1 OpenTable (4 couverts) manquent, plus toutes celles ajoutées manuellement depuis le dashboard.

3. **La date n'est pas la même.** La liste classe par jour de venue ; les compteurs d'Analytics classent par jour où la réservation a été prise. Une réservation prise le 28 août pour le 5 septembre apparaît en août côté Analytics, en septembre côté liste. De plus, si on modifie le nombre de convives d'une réservation, le compteur d'Analytics n'est pas mis à jour.

## Correction proposée

Faire calculer Données & Analytics à partir de la vraie liste des réservations, comme la page Réservations :

- Réservations, couverts et graphique journalier calculés sur la table des réservations du mois, **par date de venue**, en excluant les doublons.
- Les clics restent issus des compteurs de liens (c'est leur seul rôle) ; le taux de conversion = réservations issues d'un lien suivi ÷ clics, avec une mention claire.
- Répartition par canal basée sur le canal / la source réelle de chaque réservation, avec une ligne pour « IA », « OpenTable » et « Ajout manuel ».
- Export CSV et rapport PDF alignés sur ces mêmes chiffres.
- L'évolution mois précédent recalculée sur la même base.

## Détails techniques

- `src/hooks/useMonthlyData.ts` : agréger `reservations` filtrées sur `reservation_date` dans le mois et `is_duplicate = false`, au lieu de `channel_stats` ; garder `channel_stats` uniquement pour `clicks`. Même changement pour le mois courant (`useRealtimeChannelsData.ts`) afin que les deux chemins soient cohérents.
- `src/components/Data/DataSection.tsx` : `getDailyData()` utilise déjà `reservation_date`, mais la requête filtre sur `created_at` — à aligner.
- `src/hooks/usePDFReport.ts` : vérifier que le rapport utilise les nouveaux totaux.
