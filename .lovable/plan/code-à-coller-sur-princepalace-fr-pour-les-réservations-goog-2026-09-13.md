# Code à coller sur princepalace.fr pour les réservations Google Ads

## Objectif

Quand un visiteur arrive sur `princepalace.fr` depuis une campagne Google Ads (`gclid`, `utm_source=google`, `utm_medium=cpc`...), le bouton « Réserver » doit l’emmener sur le lien de suivi Google Ads (`/book/google-ads`) afin que la réservation soit comptabilisée dans le canal **Google Ads**.

## Code à intégrer

Copier-coller ce script dans le **pied de page** de `princepalace.fr` (avant la balise `</body>`). Sur WordPress, les méthodes les plus simples sont :

- **Méthode 1 (recommandée, sans toucher au thème)** : installer l'extension gratuite *Insert Headers and Footers* (ou *WPCode*), aller dans *Settings → Insert Headers and Footers*, coller le script dans le champ **Scripts in Footer**, puis enregistrer.
- **Méthode 2 (thème enfant)** : ajouter le script à la fin du fichier `footer.php` du thème enfant, juste avant `</body>`.
- **Méthode 3 (functions.php du thème enfant)** : utiliser `wp_enqueue_script` pour charger un fichier `.js` externe contenant le script.

Quel que soit le choix, le script doit se trouver dans le **footer** et s'exécuter sur toutes les pages où se trouve le bouton « Réserver ».


```html
<script>
(function () {
  var BOOKING_DOMAIN = "restaurantchampselysees.fr";
  var ADS_SLUG = "google-ads";
  var STORAGE_KEY = "pp_ads_ts";
  var WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

  var pageParams = new URLSearchParams(location.search);

  function isAdsVisit() {
    var gclid = pageParams.get("gclid") || pageParams.get("gbraid") || pageParams.get("wbraid");
    var source = (pageParams.get("utm_source") || "").toLowerCase();
    var medium = (pageParams.get("utm_medium") || "").toLowerCase();
    var adsFlag = (pageParams.get("ads") || "").toLowerCase();
    if (gclid || adsFlag === "1" || adsFlag === "true") return true;
    if (source.indexOf("google") > -1 && ["cpc","ppc","paid","paidsearch","paid_search"].indexOf(medium) > -1) return true;
    return false;
  }

  function isWithinAdsWindow() {
    try {
      var ts = Number(localStorage.getItem(STORAGE_KEY) || 0);
      return ts && (Date.now() - ts < WINDOW_MS);
    } catch (e) { return false; }
  }

  if (isAdsVisit()) {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (e) {}
  }

  if (!isAdsVisit() && !isWithinAdsWindow()) return;

  function rewriteBookingUrl(href) {
    var u;
    try { u = new URL(href, location.href); } catch (e) { return href; }
    var isBookingDomain = u.hostname === BOOKING_DOMAIN || u.hostname.endsWith("." + BOOKING_DOMAIN);
    var hasBookingPath = /^\/book\/[^/]+/.test(u.pathname);
    if (!isBookingDomain || !hasBookingPath) return href;

    u.pathname = "/book/" + ADS_SLUG;
    if (!u.searchParams.has("ads")) u.searchParams.set("ads", "1");
    ["gclid","gbraid","wbraid","utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(function (k) {
      var v = pageParams.get(k);
      if (v) u.searchParams.set(k, v);
    });
    return u.toString();
  }

  function rewriteLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var original = a.getAttribute("href");
      if (!original) return;
      if (original.indexOf(BOOKING_DOMAIN) === -1 && original.indexOf("/book/") === -1) return;
      var next = rewriteBookingUrl(original);
      if (next !== original) a.setAttribute("href", next);
    });
  }

  // Premier passage au chargement
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", rewriteLinks);
  } else {
    rewriteLinks();
  }

  // Puis ré-écriture des liens ajoutés dynamiquement par Hostinger
  try {
    var observer = new MutationObserver(function () { rewriteLinks(); });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {}

  // Interception des boutons qui ne sont pas des liens <a>
  document.addEventListener("click", function (e) {
    var el = e.target.closest('a[href], button, [role="button"]');
    if (!el) return;
    var href = el.getAttribute("href") || el.dataset.href || el.getAttribute("data-link");
    if (!href || (href.indexOf(BOOKING_DOMAIN) === -1 && href.indexOf("/book/") === -1)) return;
    var next = rewriteBookingUrl(href);
    if (next !== href) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = next;
    }
  }, true);
})();
</script>
```

## Ce que fait ce code

1. **Détecte** une visite Google Ads grâce à `gclid` / `gbraid` / `wbraid` ou aux paramètres `utm_source=google` + `utm_medium=cpc|ppc|paid`.
2. **Mémorise** cette origine 30 jours dans le navigateur du visiteur (localStorage).
3. **Ré-écrit** automatiquement tout lien pointant vers `restaurantchampselysees.fr/book/...` en `restaurantchampselysees.fr/book/google-ads?ads=1&gclid=...`.
4. **Intercepte** aussi les clics sur les boutons qui ne seraient pas des balises `<a>`.

## Côté application (déjà en place)

La page de réservation reconnaît ces repères et affecte automatiquement la réservation au canal **Google Ads**.

## Vérification

1. Sur `princepalace.fr`, ajouter `?gclid=test123` à l’URL de la page.
2. Cliquer sur « Réserver » : l’URL doit maintenant contenir `/book/google-ads?ads=1&gclid=test123`.
3. Faire une réservation de test et vérifier dans **Données** du dashboard qu’elle est comptée sous **Google Ads**.
