import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Seo } from "@/components/Site/Seo";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";

export default function Contact() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Prince Palace",
    telephone: "+33159133268",
    email: SITE.email,
    url: typeof window !== "undefined" ? window.location.origin : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: "76 Avenue des Champs-Élysées",
      addressLocality: "Paris",
      postalCode: "75008",
      addressCountry: "FR",
    },
  };

  return (
    <>
      <Seo
        title="Contact & devis événementiel | Prince Palace Paris 8"
        description="Contactez le Prince Palace, 76 Avenue des Champs-Élysées, Paris 8 : téléphone, e-mail et demande de devis événementiel par WhatsApp."
        path="/contact"
        jsonLd={jsonLd}
      />

      <section className="container pt-32 sm:pt-40 pb-14">
        <Reveal className="max-w-2xl">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Contact</p>
          <h1 className="font-playfair text-4xl sm:text-5xl mb-5">Parlons de votre venue</h1>
          <p className="text-muted-foreground leading-relaxed">
            Pour une table, appelez-nous ou réservez en ligne. Pour un groupe, une privatisation ou un
            événement d'entreprise, le devis se fait de vive voix, par WhatsApp ou par téléphone.
          </p>
        </Reveal>
      </section>

      <section className="container pb-20 sm:pb-28 grid gap-6 lg:grid-cols-3">
        <Reveal>
          <article className="premium-card h-full p-8 border-primary/15">
            <MapPin className="h-7 w-7 text-primary mb-5" />
            <h2 className="font-playfair text-xl mb-3">Adresse</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {SITE.addressPrimary}
              <br />
              Entrée également : {SITE.addressSecondary}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              Métro George V ou Franklin D. Roosevelt, ligne 1.
            </p>
          </article>
        </Reveal>

        <Reveal delay={90}>
          <article className="premium-card h-full p-8 border-primary/15">
            <Phone className="h-7 w-7 text-primary mb-5" />
            <h2 className="font-playfair text-xl mb-3">Téléphone & e-mail</h2>
            <a href={SITE.phoneHref} className="block text-sm text-primary hover:underline">
              {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="block text-sm text-muted-foreground hover:text-primary transition-colors mt-2 break-all"
            >
              {SITE.email}
            </a>
            <p className="flex items-center gap-2 text-sm text-muted-foreground mt-5">
              <Clock className="h-4 w-4 text-primary" /> Service à partir de 17h, 7j/7
            </p>
          </article>
        </Reveal>

        <Reveal delay={180}>
          <article className="premium-card h-full p-8 border-primary/50 shadow-gold">
            <MessageCircle className="h-7 w-7 text-primary mb-5" />
            <h2 className="font-playfair text-xl mb-3">Devis événementiel</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Indiquez-nous le type d'événement, la date souhaitée et le nombre de personnes : nous
              vous répondons avec une proposition sur mesure.
            </p>
            <a
              href={whatsappLink(DEVIS_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button block text-center bg-gradient-gold text-primary-foreground py-3 font-medium"
            >
              Demander un devis sur WhatsApp
            </a>
            <a
              href={SITE.phoneHref}
              className="premium-button block text-center border border-primary/50 text-primary py-3 mt-3"
            >
              Appeler {SITE.phone}
            </a>
          </article>
        </Reveal>
      </section>

      <section className="border-t border-primary/10 bg-gradient-subtle">
        <div className="container py-16 text-center">
          <Reveal>
            <h2 className="font-playfair text-2xl sm:text-3xl mb-6">Réserver une table</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Réservation en ligne
              </a>
              <Link to="/evenementiel" className="premium-button border border-primary/50 text-primary px-8 py-4">
                Voir l'événementiel
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
