# Lien vers le Réveillon de la Saint-Sylvestre (princepalace.fr)

## Objectif
Ajouter, sur 2 pages du site, une courte mention invitant à retrouver les informations du Réveillon de la Saint-Sylvestre, avec un lien vers https://princepalace.fr/reveillon-saint-sylvestre-champs-elysees/ pour renforcer le référencement de princepalace.fr.

## Pages choisies
1. **Événementiel** (`/evenementiel`) : la page la plus forte du site sur les soirées et événements, la plus logique pour un réveillon.
2. **Privatisation** (`/privatisation-restaurant-paris`) : les visiteurs qui cherchent une grande soirée privée sont aussi ceux qui réservent un réveillon.

## Contenu ajouté (identique dans l'esprit sur les 2 pages, formulé différemment pour éviter le texte dupliqué)
- Un paragraphe naturel de 1 à 2 phrases, intégré dans le texte existant près du bas de page (avant la FAQ), sans encadré, badge ni nouveau bloc visuel.
- Exemple page Événementiel : « Vous préparez la fin d'année ? Retrouvez toutes les informations sur notre **réveillon de la Saint-Sylvestre aux Champs-Élysées**. »
- Exemple page Privatisation : « Pour le 31 décembre, découvrez le programme du **réveillon de la Saint-Sylvestre au Prince Palace**. »
- Le texte en gras est le lien, avec des mots-clés descriptifs (bon pour Google), ouvert dans un nouvel onglet.

## Ce qui ne change pas
Aucune autre page, ni la réservation, ni le suivi des liens, ni le tableau de bord. Aucun prix ni détail du réveillon inventé.

## Détails techniques
- Lien `<a href="https://princepalace.fr/reveillon-saint-sylvestre-champs-elysees/" target="_blank" rel="noopener">` (sans `nofollow`, pour transmettre la valeur SEO).
- Fichiers : `src/pages/site/Evenementiel.tsx`, `src/pages/site/Privatisation.tsx`, style texte existant (`text-primary` souligné au survol).
- Vérification à l'écran des deux pages après modification.
