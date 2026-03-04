

# Double confirmation : Email + SMS via Twilio

## Approche

Oui, Twilio est une excellente option pour l'envoi de SMS. Il faudra créer un compte Twilio et configurer les credentials nécessaires.

## Prérequis (action manuelle)

1. Créer un compte sur [twilio.com](https://www.twilio.com)
2. Récupérer les 3 informations suivantes depuis la console Twilio :
   - **Account SID** (identifiant du compte)
   - **Auth Token** (token d'authentification)
   - **Numéro de téléphone Twilio** (numéro d'envoi, format international ex: `+33xxxxxxxxx`)

## Modifications techniques

### 1. Ajouter 3 secrets au projet
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

### 2. Créer une nouvelle Edge Function `send-reservation-sms`
- Utilise l'API REST Twilio pour envoyer un SMS
- Message concis contenant : nom du client, date, heure, nombre de couverts
- Exemple de message : "Bonjour [Nom], votre réservation au Prince Palace est confirmée pour le [date] à [heure] ([X] pers.). À bientôt !"
- Gestion d'erreur silencieuse (ne bloque pas la réservation)

### 3. Modifier `AddReservationDialog.tsx` et `BookingForm.tsx`
- Après l'envoi d'email, appeler `supabase.functions.invoke('send-reservation-sms', { body: smsData })` avec le numéro de téléphone du client
- Le SMS est envoyé systématiquement car le téléphone est obligatoire dans le formulaire

## Résultat attendu
- Chaque réservation déclenche un email (si email fourni) ET un SMS (toujours, car le téléphone est requis)
- Les deux envois sont indépendants : si l'un échoue, l'autre fonctionne quand même
- La réservation est créée même si les notifications échouent

