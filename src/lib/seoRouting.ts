const SEO_ORIGIN = "https://restaurantchampselysees.fr";

export function canonicalUrl(path: string): string {
  const pathname = path.split(/[?#]/)[0];
  const normalized = `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  return `${SEO_ORIGIN}${normalized}`;
}

export function isNoindexPath(pathname: string): boolean {
  return /^\/(?:login\/?$|book\/[^/]+\/?$|reservation\/(?:modify|cancel)\/[^/]+\/?$|email-preview(?:-thankyou)?\/?$)/.test(pathname);
}