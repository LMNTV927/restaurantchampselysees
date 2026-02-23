

# Mise en place de l'envoi automatique d'emails de confirmation

## Etat actuel

L'infrastructure est deja en place :
- La fonction backend `send-reservation-confirmation` existe avec un template email professionnel
- Le formulaire de reservation public (page booking) envoie deja l'email quand un email client est fourni
- Le secret `RESEND_API_KEY` est configure

## Ce qui doit etre modifie

### 1. Ajouter l'envoi d'email dans le formulaire d'ajout manuel

Le composant `AddReservationDialog.tsx` cree des reservations mais n'envoie pas d'email de confirmation. Il faut ajouter l'appel a la fonction backend apres l'insertion reussie, uniquement si un email client est fourni.

### 2. Verifier le domaine Resend (action manuelle requise)

Actuellement, l'adresse d'envoi est `confirmation@resend.dev` (mode sandbox). Cela signifie que les emails ne sont envoyes qu'aux adresses verifiees manuellement dans votre compte Resend.

Pour envoyer a tous vos clients :
1. Aller sur https://resend.com/domains
2. Ajouter et verifier votre domaine (ex: `votredomaine.com`)
3. Mettre a jour l'adresse d'envoi dans la fonction backend (ex: `confirmation@votredomaine.com`)

### 3. Mettre a jour l'adresse d'envoi dans la fonction backend

Remplacer `confirmation@resend.dev` par l'adresse basee sur votre domaine verifie.

## Details techniques

### Modification de `AddReservationDialog.tsx`
- Apres l'insertion reussie dans la base de donnees, verifier si `customerEmail` est fourni
- Si oui, appeler `supabase.functions.invoke('send-reservation-confirmation', { body: emailData })`
- Recuperer le nom du canal pour le nom du restaurant
- Ne pas bloquer la creation de reservation si l'email echoue (try/catch silencieux)

### Modification de `send-reservation-confirmation/index.ts`
- Mettre a jour l'adresse `from` une fois le domaine verifie
- Ajouter les headers CORS manquants pour la compatibilite

## Resultat attendu
- Chaque reservation (publique ou manuelle) avec un email client recoit automatiquement un email de confirmation
- L'email contient tous les details : date, heure, nombre de personnes, notes
- Si l'envoi echoue, la reservation est quand meme creee

