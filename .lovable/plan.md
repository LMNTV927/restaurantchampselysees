## Diagnostic (vérifié dans le code)

La page `/book/:slug` n'est **pas optimisée**. Points constatés :

1. **~9,8 Mo d'images de fond** chargés sur chaque ouverture de lien
   `src/assets/dish-1..4.jpg` pèsent respectivement 3,1 Mo / 0,9 Mo / 2,8 Mo / 3,0 Mo, en JPEG pleine résolution, tous importés d'un coup dans `BookingPage.tsx`. En 4G mobile, cela représente plusieurs secondes avant un visuel propre.
2. **Logo de 250 Ko en PNG** (`public/lovable-uploads/ce9ac516...png`) affiché en 64×64 px.
3. **Aucun découpage de bundle** : `App.tsx` importe en statique tout le dashboard (Index, hooks temps réel, recharts, jsPDF, etc.). Un client qui ouvre un lien de réservation télécharge donc tout le code de l'app d'administration.
4. **Appel bloquant avant l'affichage** : dans `BookingPage.tsx`, `await supabase.rpc('increment_channel_clicks')` s'exécute **avant** la récupération du canal — le tracking retarde l'affichage du formulaire.
5. **Polices Google en `<link>` bloquant le rendu**, sans `preconnect` effectif sur le CSS critique.
6. **Aucune balise `preload`** pour la première image du carrousel (candidat LCP).
7. **Friction UX** : 5 étapes avec navigation manuelle « Suivant » même quand le choix est unique (date, heure, convives déclenchent naturellement le passage à l'étape suivante).

## Ce qui sera fait

### Poids des médias
- Ajout de `vite-imagetools` et import des 4 images en WebP redimensionnées (largeurs ~1280 desktop / ~800 mobile), avec qualité adaptée. Objectif : passer de ~9,8 Mo à moins de 400 Ko au total.
- Chargement **immédiat de la 1re image uniquement**, les 3 autres préchargées en arrière-plan après le premier rendu (le carrousel ne démarre qu'ensuite).
- `fetchpriority="high"` + `decoding="async"` sur la première image, `loading="lazy"` sur les suivantes.
- Logo servi en version compressée et dimensionnée (width/height explicites pour éviter le décalage de mise en page).

### Bundle / code splitting
- Passage des routes d'administration (`Index`, previews email, pages modify/cancel) en `React.lazy` + `Suspense`, en gardant `BookingPage` en import direct pour qu'elle soit dans le chunk d'entrée.
- Résultat : le visiteur d'un lien de réservation ne télécharge plus recharts / jsPDF / hooks dashboard.

### Latence réseau
- `increment_channel_clicks` déplacé en appel **non bloquant** (fire-and-forget) après le chargement du canal.
- Requête `channels` réduite aux colonnes utiles (`id, name, slug`) au lieu de `select('*')`.

### Rendu initial
- Polices : `preconnect` conservé, ajout de `media="print" onload` (chargement non bloquant) et repli système, pour ne plus bloquer le premier rendu.
- `preload` de l'image LCP dans `index.html`.
- Réduction du `backdrop-blur-sm` plein écran sur mobile (coûteux en GPU sur les appareils modestes) au profit d'un simple voile sombre.

### Friction du formulaire (mobile)
- Passage automatique à l'étape suivante après sélection d'une date, d'une heure ou du nombre de convives (avec possibilité de revenir en arrière).
- Champs contact : `type="tel"`, `type="email"`, `autoComplete` (`name`, `tel`, `email`) pour déclencher le bon clavier et l'autoremplissage mobile.
- Zones tactiles des créneaux horaires à minimum 44 px de hauteur.

## Détails techniques

- Nouvelle dépendance : `vite-imagetools`, branchée dans `vite.config.ts`.
- Fichiers modifiés : `vite.config.ts`, `index.html`, `src/App.tsx`, `src/pages/BookingPage.tsx`, `src/components/Booking/ImageCarousel.tsx`, `src/components/Booking/BookingForm.tsx`, `steps/DateStep.tsx`, `steps/TimeStep.tsx`, `steps/GuestsStep.tsx`, `steps/ContactStep.tsx`.
- Aucun changement de logique métier, de base de données ni de contenu des emails/SMS.
- Vérification finale : mesure du poids transféré et du temps d'affichage du formulaire sur un lien réel, en simulation mobile.
