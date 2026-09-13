# Attribuer à Google Ads les réservations passant par princepalace.fr

## Le problème

Une personne clique sur votre annonce, arrive sur `princepalace.fr` avec des repères Google Ads dans l'adresse (`gclid`, `utm_source`...). Sur cette page, le bouton « Réserver » envoie vers un lien fixe `.../book/site-internet` : tous les repères Google Ads sont perdus en route, donc la réservation est comptée en « Site Internet ».

La page de réservation sait déjà reconnaître une visite Google Ads quand les repères sont présents dans l'adresse. Il suffit donc de les transmettre au moment du clic.

## La solution

1. **Un petit code à coller sur princepalace.fr** (vous avez l'accès) : au chargement de la page, il repère si le visiteur vient de Google Ads et, si oui, complète automatiquement tous les boutons « Réserver » avec ces repères. Aucun autre changement sur ce site, et les visiteurs normaux ne voient aucune différence.

2. **Côté page de réservation (ici)** : rendre la reconnaissance plus solide.
   - Mémoriser l'origine Google Ads pendant 30 jours au lieu de la seule session, pour couvrir la personne qui revient réserver un peu plus tard.
   - Accepter aussi un repère simple `?ads=1` au cas où Google supprimerait `gclid`.
   - Garder exactement le comportement actuel de repli : si le canal Google Ads est indisponible, le canal du lien est utilisé.

3. **Historique** : rien n'est modifié, l'attribution démarre à partir de la mise en place.

## Le code à coller sur princepalace.fr

À placer dans le pied de page du site (zone « code personnalisé » / footer) :

```html
<script>
(function () {
  var p = new URLSearchParams(location.search);
  var ads = p.get('gclid') || p.get('gbraid') || p.get('wbraid') ||
    ((p.get('utm_source') || '').toLowerCase().indexOf('google') > -1 &&
     ['cpc','ppc','paid','paidsearch','paid_search'].indexOf((p.get('utm_medium') || '').toLowerCase()) > -1);
  if (ads) { try { localStorage.setItem('pp_ads', String(Date.now())); } catch (e) {} }
  var stored = 0;
  try { stored = Number(localStorage.getItem('pp_ads') || 0); } catch (e) {}
  if (!ads && !(stored && Date.now() - stored < 30 * 864e5)) return;
  document.querySelectorAll('a[href*="/book/"]').forEach(function (a) {
    var u = new URL(a.href, location.href);
    u.searchParams.set('ads', '1');
    ['gclid','gbraid','wbraid','utm_source','utm_medium','utm_campaign'].forEach(function (k) {
      if (p.get(k)) u.searchParams.set(k, p.get(k));
    });
    a.href = u.toString();
  });
})();
</script>
```

## Détails techniques

- `src/pages/BookingPage.tsx` : `detectGoogleAds()` accepte `ads=1` et stocke l'origine dans `localStorage` avec horodatage (fenêtre de 30 jours), avec repli sur `sessionStorage`.
- Aucune modification de la route `/book/:slug`, du comptage des clics (`increment_channel_clicks`), des statistiques de canaux ni de la base de données.
- Le canal `google-ads` existe déjà : les clics et réservations lui seront rattachés automatiquement.

## Vérification

Ouvrir `https://restaurantchampselysees.fr/book/site-internet?ads=1` et confirmer dans Données que le clic est compté sur Google Ads, puis tester une réservation de test depuis princepalace.fr avec `?gclid=test`.
