# Corriger le chevauchement Aujourd'hui / Prochains 7 jours

## Diagnostic (vérifié dans le code)

Ce n'est pas normal : c'est un bug de fuseau horaire dans l'onglet Réservations.

- Pour calculer « demain » et « dans 7 jours », le code crée minuit heure de Paris puis le convertit en heure UTC (`toISOString`). Paris étant en UTC+2, minuit le 4 octobre devient « 3 octobre 22h » en UTC.
- Résultat : « demain » vaut en réalité **aujourd'hui**, et « dans 7 jours » vaut **J+6**.
- Conséquences :
  - « Prochains 7 jours » contient les réservations d'aujourd'hui (doublon avec « Aujourd'hui ») et s'arrête un jour trop tôt.
  - « Tout à venir » commence à J+6 au lieu de J+7, donc une journée apparaît au mauvais endroit.

## Changements prévus

1. `src/components/Reservations/ReservationsSection.tsx` : calculer « demain » et « J+7 » par simple calcul de date sur la chaîne `AAAA-MM-JJ` (en UTC des deux côtés), sans décalage de fuseau.
2. Vérifier les autres usages du même schéma (`toISOString().split('T')[0]`) dans le code et les corriger de la même façon s'ils existent.
3. Vérification à l'écran : « Aujourd'hui » = uniquement le jour même, « Prochains 7 jours » = J+1 à J+7, « Tout à venir » = au-delà, sans aucune réservation en double entre les onglets.

## Ce qui ne change pas

Onglet Données, Dashboard, tracking, liens de réservation : inchangés. Aucune modification de la base.
