# Nouvelle page article SEO : « Restaurant ouvert la nuit à Paris »

## Objectif
Créer une nouvelle page article dédiée, indexable par Google, sur le modèle de la page Anniversaire (`/anniversaire-restaurant-paris`), sans dupliquer les pages existantes.

## Mot-clé ciblé (données Semrush, France)
- **« restaurant ouvert la nuit paris »** : 210 recherches/mois, concurrence faible (difficulté 23/100) — opportunité réelle.
- Mots-clés secondaires intégrés naturellement : « restaurant ouvert tard paris », « manger après minuit paris », « restaurant champs-élysées nuit ».
- Cohérent avec l'établissement : service dès 17h, ouvert jusqu'à 5h du matin, ambiance club et DJ après minuit.

## Contenu de la page
- **URL** : `/restaurant-ouvert-la-nuit-paris`
- **Titre SEO (title)** : « Restaurant ouvert la nuit à Paris | Dîner jusqu'à 5h – Champs-Élysées »
- **Meta description** : ~155 caractères, mentionnant horaires 17h-5h, Champs-Élysées, réservation en ligne.
- **Structure** (même gabarit que la page Anniversaire : HeroSection, Reveal, images existantes) :
  1. H1 + introduction : manger tard à Paris, un vrai problème — la solution aux Champs-Élysées.
  2. Section « Les horaires » : service 17h → 5h, dernières arrivées tardives, 7j/7.
  3. Section « Pour qui ? » : sorties de spectacle, équipes de nuit, groupes, afterwork qui s'éternise.
  4. Section « La nuit en 3 temps » : dîner (17h-minuit) → ambiance club et DJ (minuit-5h).
  5. Bloc « Questions fréquentes » (Accordion) : 4 questions (dernière réservation possible, ouvert les jours fériés, vestiaire/sécurité, transport de nuit à proximité).
  6. CTA : bouton « Réserver une table » (lien de réservation) + WhatsApp.
- **Données structurées JSON-LD** : `Article` + `FAQPage` (comme la page Anniversaire).
- **Aucune mention chicha/fumer** (règle du projet).

## Intégration technique
- Nouveau fichier `src/pages/site/RestaurantNuit.tsx` (copie adaptée du gabarit `Anniversaire.tsx`, images déjà présentes dans `src/assets/site/`).
- Route ajoutée dans `src/App.tsx` : `/restaurant-ouvert-la-nuit-paris`.
- Entrée ajoutée dans `public/sitemap.xml` : `https://restaurantchampselysees.fr/restaurant-ouvert-la-nuit-paris`.
- Lien ajouté dans le pied de page (`SiteLayout.tsx`), à côté du lien Anniversaire.
- Balises `<title>` / meta / canonical via le composant `Seo` existant.

## Vérification
- Compilation sans erreur.
- Ouverture de la page dans l'aperçu : contenu, FAQ, CTA visibles.
- Le lien de la page sera fourni après création ; indexation à demander dans Google Search Console après publication.
