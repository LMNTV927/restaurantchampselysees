import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, Instagram, Facebook, Cookie } from "lucide-react";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";
import { PRINCE_PALACE_LOGO } from "@/lib/dishImages";

const NAV = [
  { to: "/", label: "Le lieu" },
  { to: "/evenementiel", label: "Événementiel" },
  { to: "/restaurant", label: "Restaurant" },
  { to: "/galerie", label: "Galerie" },
  { to: "/avis", label: "Avis" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

function CookieButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {open && (
        <div className="mb-3 w-64 rounded-2xl border border-primary/25 bg-card p-4 text-xs text-muted-foreground shadow-large">
          <p className="mb-3 leading-relaxed">
            Nous utilisons des cookies de mesure d'audience pour améliorer votre expérience.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                localStorage.setItem("pp-cookies", "all");
                setOpen(false);
              }}
              className="flex-1 rounded-full bg-primary py-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground"
            >
              Tout accepter
            </button>
            <button
              onClick={() => {
                localStorage.setItem("pp-cookies", "essential");
                setOpen(false);
              }}
              className="flex-1 rounded-full border border-primary/40 py-2 text-[11px] uppercase tracking-wider text-primary"
            >
              Refuser
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Paramètres cookies"
        className="flex items-center gap-2 rounded-full border border-primary/30 bg-background/90 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur hover:text-primary"
      >
        <Cookie className="h-3.5 w-3.5" />
        Cookies
      </button>
    </div>
  );
}

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
          scrolled && !open ? "bg-background/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Gauche : logo badge + langue + réseaux */}
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="Prince Palace, accueil" className="flex items-center gap-2">
              <img
                src={PRINCE_PALACE_LOGO}
                alt="Logo Prince Palace, restaurant lounge événementiel aux Champs-Élysées"
                width={40}
                height={40}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-primary/50"
              />
              <span className="hidden sm:inline text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                FR
              </span>
            </Link>
            <span className="hidden lg:flex items-center gap-3 pl-2">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram Prince Palace">
                <Instagram className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook Prince Palace">
                <Facebook className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </a>
            </span>
          </div>

          {/* Centre-droit : navigation desktop */}
          <nav className="hidden lg:flex items-center gap-7 ml-auto mr-2">
            {NAV.slice(0, 4).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-foreground/90"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={SITE.bookingPath} className="pill px-5 py-2.5 sm:px-7 sm:py-3 -rotate-2">
              Réservez
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className="p-2 text-foreground/90 hover:text-primary transition-colors"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu plein écran */}
      <div
        className={`fixed inset-0 z-40 bg-background/97 backdrop-blur-xl transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="container h-full flex flex-col justify-center items-center gap-5 sm:gap-7">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `display text-2xl sm:text-4xl transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-foreground/90"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <span className="h-px w-16 bg-primary/40 my-2" />
          <a
            href={whatsappLink(DEVIS_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] uppercase tracking-[0.28em] text-primary"
          >
            Demander un devis événementiel
          </a>
        </nav>
      </div>

      <main>
        <Outlet />
      </main>

      <footer style={{ background: "hsl(var(--gold-deep))", color: "hsl(var(--on-gold))" }}>
        <div className="container py-14 grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="display text-xl mb-4">Nous rejoindre</h2>
            <p className="text-sm opacity-90 leading-relaxed mb-3">
              Salle, bar, cuisine : nous recrutons toute l'année des profils passionnés.
            </p>
            <a href={`mailto:${SITE.email}`} className="text-sm underline underline-offset-4">
              Envoyer une candidature
            </a>
          </div>

          <div>
            <h2 className="display text-xl mb-4">Nos sites</h2>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <a href={SITE.restaurantSite} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  princepalace.fr — la carte
                </a>
              </li>
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:text-right">
            <p className="display text-xl mb-4">Prince Palace</p>
            <address className="not-italic text-sm opacity-90 space-y-1 leading-relaxed">
              <p>{SITE.addressPrimary}</p>
              <p>{SITE.addressSecondary}</p>
              <p>
                <a href={SITE.phoneHref} className="hover:underline">
                  {SITE.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="hover:underline break-all">
                  {SITE.email}
                </a>
              </p>
            </address>
            <div className="flex gap-4 mt-4 md:justify-end">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram Prince Palace">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook Prince Palace">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid hsl(var(--on-gold) / 0.25)" }}>
          <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-90">
            <p>© {new Date().getFullYear()} Prince Palace — Paris 8. Tous droits réservés.</p>
            <Link to="/mentions-legales" className="hover:underline">
              Mentions légales & Confidentialité
            </Link>
          </div>
        </div>
      </footer>

      <CookieButton />
    </div>
  );
}
