# Optimisation de la vitesse des liens de réservation

Objectif : que `/book/:slug` s'affiche quasi instantanément sur mobile, sans écran de chargement perceptible.

## Problèmes identifiés

1. **Images trop lourdes** : les 4 photos de plats du fond pèsent 9,8 Mo au total (dish-1 : 3,1 Mo, dish-3 : 2,8 Mo, dish-4 : 3,0 Mo). Sur 4G mobile, c'est plusieurs secondes avant d'avoir un visuel.
2. **Tout le code de l'app est chargé d'un coup** : le tableau de bord, les pages d'e-mails, l'assistant IA, les graphiques et l'export PDF sont importés dans le même bundle que la page de réservation. Un client qui ouvre un lien télécharge du code qu'il n'utilisera jamais.
3. **Le formulaire attend la base de données** : la page affiche « Chargement... » tant que le canal n'est pas récupéré, et le comptage du clic est attendu avant même de lancer la requête du canal (deux allers-retours en série).
4. **Le logo** est un PNG de 250 Ko non préchargé.

## Ce qui va être fait

**Images**
- Conversion des 4 photos en WebP compressé et redimensionné (largeur max ~1600 px, plus une variante mobile ~800 px), objectif : passer de 9,8 Mo à environ 300-500 Ko au total.
- Affichage immédiat de la première image seulement ; les 3 autres sont chargées en arrière-plan après le premier rendu (le carrousel garde ses 5 s de défilement et son zoom subtil).
- Préchargement prioritaire de la première image + du logo, et compression du logo.

**Chargement du code**
- Découpage par route : la page de réservation ne chargera que son propre code. Le tableau de bord, les pages d'aperçu d'e-mails, modification/annulation et login deviennent des chargements différés.
- Les étapes du tunnel de réservation (date, heure, convives, contact, résumé, succès) restent groupées avec la page pour éviter tout à-coup entre les étapes.

**Réseau**
- Le comptage du clic ne bloque plus l'affichage : il part en parallèle de la récupération du canal.
- Préconnexion au serveur backend depuis le `<head>` pour supprimer le coût de la négociation réseau au premier appel.
- Le formulaire s'affiche immédiatement (première étape rendue tout de suite), le canal étant résolu en arrière-plan ; en cas de lien invalide, le message d'erreur reste affiché comme aujourd'hui.

**Rendu mobile**
- Suppression du `backdrop-blur` plein écran sur le fond (très coûteux sur mobile) au profit d'un simple voile sombre au rendu identique.
- Animations d'entrée raccourcies pour que le formulaire soit utilisable plus vite.

## Détails techniques

- `vite-imagetools` pour générer les variantes WebP/AVIF à la compilation, avec `<picture>`/`srcset` dans le carrousel.
- `React.lazy` + `Suspense` dans `src/App.tsx` pour toutes les routes sauf `/book/:slug`.
- `BookingPage` : `Promise.all` sur le RPC de clic et la requête `channels`, avec rendu optimiste du formulaire.
- `index.html` : `preconnect` vers le backend, `preload` de l'image LCP et du logo.
- Aucune modification du comportement métier, des horaires, des e-mails/SMS ou du suivi Google Ads.

## Résultat attendu

Ouverture du lien perçue comme immédiate sur mobile : premier affichage sous ~1 s au lieu de plusieurs secondes, et navigation entre les étapes du formulaire sans latence.
