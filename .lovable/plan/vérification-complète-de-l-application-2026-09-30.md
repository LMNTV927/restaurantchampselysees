# Vérification complète de l'application

Aucune erreur bloquante n'apparaît actuellement (compilation OK, aucune erreur d'exécution). Deux petits avertissements restent à nettoyer.

## 1. Test complet, écran par écran (navigateur automatisé, connecté en admin)
- Site public : Accueil, Restaurant, Événementiel, Galerie, Avis, FAQ, Contact, Mentions légales (ordinateur + téléphone).
- Réservation client `/book/google-ads` et `/book/site-internet` : les 5 étapes jusqu'au récapitulatif (sans envoyer de vraie réservation).
- Dashboard : chiffres, graphiques, « Réservations prises » (changement de date, bouton « Aujourd'hui », réservations TheFork « À confirmer »).
- Liens : dépliage Google Ads (Search / PMax), copier, interrupteur, menu.
- Réservations : tous les filtres, bouton « i », Présent/Absent, commentaire, modification, fiche client, doublons/restaurer.
- Données : camembert, tableaux, export PDF.
- Clients : recherche, tri, ouverture de fiche.
- Assistant IA : une question simple.
- Relève Yahoo (OpenTable + TheFork) : un passage réel, vérification qu'aucune ligne n'est dupliquée.

## 2. Corrections à apporter
- Avertissement « key » manquant dans le tableau des liens (regroupement des lignes dépliables).
- Message « Auth initialization timeout » : vérifier que la connexion ne se bloque pas à l'ouverture du dashboard ; corriger seulement si un vrai problème est constaté.
- Tout autre bug trouvé à l'étape 1 est corrigé dans la foulée, sans changement visuel.

## 3. Compte rendu
Liste de ce qui a été testé, captures des points clés, bugs trouvés et corrigés.

## Contraintes
Aucune réservation de test laissée en base, aucune suppression, aucune migration, aucun nouvel élément visuel.
