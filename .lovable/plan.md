# Deux nouvelles pages SEO : EVJF et Soirée d'entreprise

Les pages Anniversaire, Afterwork et Privatisation existent déjà. Pour éviter qu'elles se fassent concurrence sur Google, les deux nouvelles pages visent des recherches différentes, mais du même univers (club, événementiel, privatisation).

## Mots-clés choisis (données Semrush France)
| Page | Mot-clé principal | Recherches/mois | Difficulté |
|---|---|---|---|
| EVJF à Paris | « evjf paris » (+ « enterrement de vie de jeune fille », « idée evjf ») | 1 000 | 21/100 (faible) |
| Soirée d'entreprise | « soirée entreprise paris » (+ « soirée d'entreprise », « événement entreprise paris », « cocktail entreprise paris ») | 720 + 390 | 18/100 (faible) |

## Pages
1. **/evjf-paris-champs-elysees** : « EVJF à Paris : dîner, DJ et soirée club aux Champs-Élysées »
   - Pourquoi fêter un EVJF ici : dîner dès 17h, club dès 1h, jusqu'à 5h.
   - Le déroulé d'une soirée EVJF : dîner, puis piste avec DJ.
   - Espace dédié dès 10 personnes, ou privatisation.
   - Conseils d'organisation : réserver tôt, créneau de 3h, accès au 59 rue de Ponthieu après 22h.
   - FAQ de 4 questions.
2. **/soiree-entreprise-paris** : « Soirée d'entreprise à Paris : 500 places aux Champs-Élysées »
   - Les formats proposés : afterwork, cocktail, dîner assis, soirée de fin d'année, lancement.
   - La capacité, les 3 formules de privatisation et le DJ.
   - Comment organiser sa soirée : devis WhatsApp, proposition détaillée.
   - FAQ de 4 questions.

## Règles de rédaction
- Texte naturel, écrit pour les clients, sans répétition forcée des mots-clés.
- Uniquement des informations réelles : 500 places, horaires, adresses, accès, DJ, devis WhatsApp. Aucun prix, aucun avis ni chiffre inventé.
- Aucune mention de la chicha ou du fait de fumer.

## Liens et indexation
- Pour Google : titre, description, adresse canonique, données structurées Article et FAQPage.
- Liens croisés vers Privatisation, Anniversaire, Afterwork et Événementiel. Ajout au pied de page et au sitemap.
- Boutons « Réserver une table » et « Demander un devis ».

## Détails techniques
- Nouveaux fichiers `src/pages/site/Evjf.tsx` et `src/pages/site/SoireeEntreprise.tsx`, sur le modèle de `Privatisation.tsx`, avec les images existantes de `src/assets/site`.
- Ajout des routes dans `App.tsx`, des liens dans `SiteLayout.tsx` et des pages dans `public/sitemap.xml`.
- Vérification de l'affichage des deux pages à l'écran.
