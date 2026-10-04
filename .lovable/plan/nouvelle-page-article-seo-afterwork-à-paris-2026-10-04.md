# Nouvelle page article SEO : « Afterwork à Paris »

## Objectif
Créer une nouvelle page article dédiée, indexable par Google, sur le modèle de la page Anniversaire (`/anniversaire-restaurant-paris`). Règle enregistrée : les articles portent toujours sur le club, l'événementiel et la privatisation (afterwork, EVJF, dîner d'entreprise, soirées, DJ).

## Mot-clé ciblé (données Semrush, France)
- **« afterwork paris »** : 880 recherches/mois, concurrence faible (difficulté 19/100) — excellente opportunité.
- Mots-clés secondaires intégrés naturellement : « où faire un afterwork à paris », « afterwork champs-élysées », « afterwork entreprise paris ».
- Cohérent avec l'établissement : service dès 17h (horaires parfaits pour l'afterwork), espaces privatifs, DJ et ambiance club jusqu'à 5h.

## Contenu de la page
- **URL** : `/afterwork-paris-champs-elysees`
- **Titre SEO (title)** : « Afterwork à Paris : dîner, DJ et privatisation aux Champs-Élysées »
- **Meta description** : ~155 caractères, mentionnant afterwork dès 17h, groupes d'entreprise, privatisation, DJ jusqu'à 5h.
- **Structure** (même gabarit que la page Anniversaire : HeroSection, Reveal, images existantes) :
  1. H1 + introduction : où faire un afterwork à Paris — la réponse aux Champs-Élysées.
  2. Section « L'afterwork idéal » : ouverture 17h, cocktails et dîner, à deux pas du métro.
  3. Section « Pour les entreprises » : dîners d'équipe, espaces privatifs, devis sur mesure.
  4. Section « Prolonger la soirée » : DJ et ambiance club de minuit à 5h, sans changer de lieu.
  5. Bloc « Questions fréquentes » (Accordion) : 4 questions (horaires, taille des groupes, privatisation, réservation).
  6. CTA : bouton « Réserver une table » + WhatsApp / demande de devis.
- **Données structurées JSON-LD** : `Article` + `FAQPage` (comme la page Anniversaire).
- **Aucune mention chicha/fumer** (règle du projet).

## Intégration technique
- Nouveau fichier `src/pages/site/Afterwork.tsx` (copie adaptée du gabarit `Anniversaire.tsx`, images déjà présentes dans `src/assets/site/`).
- Route ajoutée dans `src/App.tsx` : `/afterwork-paris-champs-elysees`.
- Entrée ajoutée dans `public/sitemap.xml`.
- Lien ajouté dans le pied de page (`SiteLayout.tsx`), à côté du lien Anniversaire.
- Balises `<title>` / meta / canonical via le composant `Seo` existant.

## Vérification
- Compilation sans erreur.
- Ouverture de la page dans l'aperçu : contenu, FAQ, CTA visibles.
- Le lien de la page sera fourni après création ; indexation à demander dans Google Search Console après publication.
