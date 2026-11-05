# Architecture rules

- Manage per-page SEO through `Seo` and react-helmet-async with one root HelmetProvider; Helmet can expose the same metadata for future prerendering without imperative head mutations.
- Apply private-route robots metadata through the head-only RouteRobots component; booking, reservation and tracking logic must remain independent of indexing policy.