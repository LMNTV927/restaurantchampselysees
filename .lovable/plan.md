# Ajouter la durée et les horaires au mail de confirmation

## Résultat attendu
- Ajouter une mention claire indiquant que chaque réservation correspond à un créneau de **3 heures**.
- Ajouter en bas du mail les horaires de la partie restauration du Prince Palace :
  - **Du lundi au mercredi : 17h00–00h00**
  - **Du jeudi au dimanche : 17h00–05h00**
- Conserver le style noir et or existant, avec une présentation sobre adaptée aux mobiles.

## Mise en œuvre
- Modifier le modèle réellement envoyé par le mail de confirmation Prince Palace.
- Afficher la durée et les horaires sur les confirmations et modifications actives, sans les présenter comme des informations de venue dans un mail d’annulation.
- Mettre à jour la page interne de prévisualisation du mail afin qu’elle reste identique au rendu envoyé.
- Ne modifier ni le fonctionnement des réservations, ni les SMS, ni les autres mails.

## Vérification
- Contrôler le rendu sur ordinateur et mobile dans la prévisualisation.
- Vérifier la compilation, puis déployer la fonction d’envoi pour que les prochains mails utilisent immédiatement le nouveau contenu.
