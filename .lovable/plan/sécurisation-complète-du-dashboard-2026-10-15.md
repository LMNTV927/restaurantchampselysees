# Sécurisation complète du dashboard

L'adresse `/dashboard` ne sera pas changée maintenant (à faire plus tard, sur votre feu vert).

## Failles trouvées
1. **N'importe quel compte connecté voit et modifie tout** : réservations (téléphones, e-mails), liens de tracking et statistiques de clics. Il n'y a aucune vérification du rôle admin ou serveur.
2. **Plusieurs fonctions serveur s'appellent sans être connecté** : relance des doublons, envoi de mails et de SMS, rappels, remerciements. Quelqu'un pourrait envoyer des SMS ou des mails à vos clients, ou déclencher des traitements.
3. **Fonctions internes de la base appelables publiquement** : 4 fonctions de calcul sont ouvertes à tout le monde.
4. **Création de comptes** : il faut vérifier que l'inscription publique est fermée et la bloquer définitivement.

## Corrections
1. **Comptes** : inscription fermée. Aucun nouveau compte admin ou serveur ne pourra être créé depuis l'application. Les comptes existants gardent leur accès.
2. **Réservations** : lecture et modification réservées aux comptes admin ou serveur. La suppression reste réservée à l'admin.
3. **Liens et statistiques** : création, modification et suppression réservées à l'admin. Lecture permise aux admins et aux serveurs. Le compteur de clics public continue de fonctionner.
4. **Fonctions serveur du dashboard** (doublons, assistant IA, relève Yahoo, import) : connexion avec un rôle admin ou serveur obligatoire.
5. **Envoi de mails et de SMS** : uniquement depuis le site de réservation ou le dashboard. Les appels anonymes ne pourront plus viser un numéro quelconque.
6. **Fonctions internes de la base** : fermées au public, sauf le compteur de clics et la vérification du rôle.
7. **Mot de passe** : refus des mots de passe ayant déjà fuité.
8. **Sans changement** : réservation publique `/book/...`, modification et annulation par le client avec son lien personnel, tracking, présentation du dashboard.

## Vérification
- Nouvelle analyse de sécurité.
- Test avec le compte admin : dashboard, réservations, liens, données.
- Test sans être connecté : la lecture des réservations doit être refusée et une réservation publique doit passer.

## Détails techniques
- Migration : supprimer les politiques `using:true` sur reservations, channels et channel_stats, puis les remplacer par `has_role(auth.uid(),'admin') OR has_role(auth.uid(),'serveur')` (admin seul pour l'écriture sur channels et channel_stats). Les triggers, en security definer, continuent d'alimenter les stats.
- `REVOKE EXECUTE` à anon et authenticated sur les fonctions trigger et `increment_channel_reservation`. On garde `increment_channel_clicks` (public) et `has_role`/`get_user_role` (authenticated).
- Edge functions sans contrôle : ajouter le modèle de `manual-opentable-import` (getUser + has_role). Les fonctions appelées par le tunnel public (create-reservation, confirmation, SMS) recherchent la réservation côté serveur par son id ou son jeton au lieu de faire confiance aux coordonnées envoyées.
- `configure_auth` : inscriptions désactivées, HIBP activé.
