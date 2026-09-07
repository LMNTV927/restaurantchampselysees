import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, Mail, Instagram, Facebook } from "lucide-react";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";
import { PRINCE_PALACE_LOGO } from "@/lib/dishImages";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/evenementiel", label: "Événementiel" },
  { to: "/restaurant", label: "Restaurant" },
  { to: "/galerie", label: "Galerie" },
  { to: "/avis", label: "Avis" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/90 backdrop-blur-md border-b border-primary/15" : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={PRINCE_PALACE_LOGO}
              alt="Logo Prince Palace, restaurant lounge événementiel aux Champs-Élysées"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl object-cover"
            />
            <span className="font-playfair text-lg sm:text-xl tracking-wide">Prince Palace</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground/80"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={SITE.bookingPath}
              className="premium-button border border-primary/60 text-primary px-5 py-2 text-sm hover:bg-primary hover:text-primary-foreground"
            >
              Réserver une table
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="lg:hidden p-2 text-foreground"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-primary/15">
            <nav className="container py-5 flex flex-col gap-4">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `text-base py-1 ${isActive ? "text-primary" : "text-foreground/85"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground text-center py-3 mt-2 font-medium"
              >
                Réserver une table
              </a>
              <a
                href={whatsappLink(DEVIS_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button border border-primary/50 text-primary text-center py-3"
              >
                Demander un devis événementiel
              </a>
            </nav>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-primary/15 bg-gradient-subtle">
        <div className="container py-14 grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={PRINCE_PALACE_LOGO}
                alt="Logo Prince Palace Paris"
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <span className="font-playfair text-lg">Prince Palace</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Restaurant lounge et lieu événementiel au cœur des Champs-Élysées. Soirées privées,
              anniversaires, cocktails et privatisations à Paris 8.
            </p>
            <div className="flex gap-4 pt-1">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram Prince Palace">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook Prince Palace">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-playfair text-base mb-4 text-primary">Navigation</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-playfair text-base mb-4 text-primary">Nous trouver</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>
                  {SITE.addressPrimary}
                  <br />
                  {SITE.addressSecondary}
                </span>
              </li>
              <li className="flex gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <a href={SITE.phoneHref} className="hover:text-primary transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-primary transition-colors break-all">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-playfair text-base mb-4 text-primary">Réserver</h2>
            <div className="space-y-3">
              <a
                href={SITE.bookingPath}
                className="premium-button block text-center bg-gradient-gold text-primary-foreground py-3 text-sm font-medium"
              >
                Réserver une table
              </a>
              <a
                href={whatsappLink(DEVIS_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button block text-center border border-primary/50 text-primary py-3 text-sm"
              >
                Devis événementiel
              </a>
              <a
                href={SITE.restaurantSite}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-muted-foreground hover:text-primary transition-colors pt-1"
              >
                Voir la carte sur princepalace.fr
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10">
          <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Prince Palace — Paris 8. Tous droits réservés.</p>
            <Link to="/mentions-legales" className="hover:text-primary transition-colors">
              Mentions légales & CGU
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
