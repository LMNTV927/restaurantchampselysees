# Liens courts pour la bio Instagram

## Résultat
- `restaurantchampselysees.fr/r` → ouvre exactement `restaurantchampselysees.fr/book/insta-restaurant`
- `restaurantchampselysees.fr/l` → ouvre exactement `restaurantchampselysees.fr/book/insta-lounge`

Le client arrive instantanément sur la page de réservation habituelle. Le clic est compté sur le même canal (Insta restaurant / Insta lounge), les réservations sont attribuées comme aujourd'hui. Les anciens liens longs continuent de fonctionner.

## Ce qui ne change pas
- La page de réservation, le formulaire, les mails/SMS.
- Le comptage des clics et des réservations (le comptage se fait sur la page de réservation, pas sur le lien court, donc aucun clic en double).
- Les canaux dans « Liens de tracking ».

## Détails techniques
- Ajouter dans `src/App.tsx` deux routes `/r` et `/l` qui font une redirection immédiate (`Navigate replace`) vers `/book/insta-restaurant` et `/book/insta-lounge`, en conservant les éventuels paramètres d'URL.
- Aucune modification de `/book/:slug`, de la base ni des fonctions serveur.
- Vérification : ouvrir `/r` et `/l`, confirmer l'arrivée sur la bonne page et l'incrément du compteur du bon canal.
- Publier ensuite pour que les liens courts fonctionnent sur le site en ligne.

## Encore plus court ?
Le chemin ne fait plus qu'une lettre. Pour raccourcir davantage, il faudrait un second nom de domaine court (par exemple `princepalace.fr/r`, que vous possédez déjà pour le restaurant) pointé vers ce site : à faire de votre côté si vous le souhaitez.
