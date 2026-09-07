import { Link } from "react-router-dom";
import { Sparkles, Users, Building2, Star, MapPin, Utensils, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";
import heroLounge from "@/assets/site/hero-lounge.jpg";
import eventSoiree from "@/assets/site/event-soiree.jpg";
import restaurantTable from "@/assets/site/restaurant-table.jpg";
import privatisation from "@/assets/site/privatisation.jpg";

const prestations = [
  {
    icon: Sparkles,
    title: "Soirées privées",
    text: "Une salle qui vous appartient le temps d'une nuit : lumière tamisée, musique et service dédié.",
  },
  {
    icon: Star,
    title: "Anniversaires",
    text: "Arrivée en fanfare, table dressée, gâteau et animation : le moment se retient longtemps.",
  },
  {
    icon: Users,
    title: "EVJF & EVG",
    text: "Des formules pensées pour les groupes, entre dîner soigné et ambiance festive.",
  },
  {
    icon: Building2,
    title: "Entreprises & team building",
    text: "Cocktails dînatoires, lancements de produit et dîners d'équipe au cœur du 8e.",
  },
];

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Prince Palace",
      description:
        "Restaurant lounge et lieu événementiel aux Champs-Élysées : soirées privées, anniversaires, cocktails et privatisation à Paris 8.",
      servesCuisine: "Cuisine méditerranéenne et internationale",
      priceRange: "€€€",
      telephone: "+33159133268",
      email: SITE.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "76 Avenue des Champs-Élysées",
        addressLocality: "Paris",
        postalCode: "75008",
        addressCountry: "FR",
      },
      areaServed: "Paris",
      sameAs: [SITE.instagram, SITE.facebook, SITE.tiktok, SITE.restaurantSite],
    },
  ];

  return (
    <>
      <Seo
        title="Prince Palace | Événementiel & restaurant lounge Champs-Élysées"
        description="Soirées privées, anniversaires, EVJF, cocktails et privatisation aux Champs-Élysées. Restaurant lounge haut de gamme à Paris 8. Réservation en ligne."
        path="/"
        jsonLd={jsonLd}
      />

      <HeroSection image={heroLounge} alt="Salle du Prince Palace, lounge noir et or aux Champs-Élysées" priority>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.06em] leading-tight">
            Prince Palace
          </h1>
          <p className="uppercase tracking-[0.55em] text-primary text-[10px] sm:text-xs mt-4 sm:mt-5 pl-[0.55em]">
            Champs-Élysées
          </p>
          <span className="block h-px w-14 bg-primary/50 mx-auto my-8 sm:my-10" />
          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed max-w-md mx-auto">
            Soirées privées, privatisations et dîners d'exception au cœur de Paris 8.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
            <a
              href={SITE.bookingPath}
              className="bg-gradient-gold text-primary-foreground px-8 py-4 text-center text-[11px] uppercase tracking-[0.25em] font-medium shadow-gold"
            >
              Réserver une table
            </a>
            <a
              href={whatsappLink(DEVIS_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary/50 text-primary px-8 py-4 text-center text-[11px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Devis événementiel
            </a>
          </div>
        </div>
      </HeroSection>


      {/* Réassurance */}
      <section className="border-y border-primary/10 bg-card/40">
        <div className="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "500", label: "personnes accueillies" },
            { value: "Paris 8", label: "Champs-Élysées" },
            { value: "7j/7", label: "soirs d'ouverture" },
            { value: "Sur mesure", label: "formules événementielles" },
          ].map((item) => (
            <Reveal key={item.label}>
              <p className="font-playfair text-2xl sm:text-3xl text-primary">{item.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Prestations */}
      <section className="container py-20 sm:py-28">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Nos prestations</p>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-5">
            Un lieu pensé pour les grandes occasions
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            De la table de dix à la privatisation complète, nous composons chaque soirée avec vous :
            accueil, formules, décoration, timing et service.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {prestations.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <article className="premium-card h-full p-7 border-primary/15 hover:border-primary/40 hover:shadow-gold transition-all duration-500">
                <p.icon className="h-7 w-7 text-primary mb-5" />
                <h3 className="font-playfair text-xl mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <Link
            to="/evenementiel"
            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"
          >
            Découvrir toutes nos formules événementielles <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* Événementiel visuel */}
      <section className="container pb-20 sm:pb-28 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <img
            src={eventSoiree}
            alt="Soirée privée célébrée au Prince Palace avec service de champagne"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Événementiel Paris</p>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-5">
            Privatisez tout ou partie du Prince Palace
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Espace lounge, mezzanine ou salle entière : jusqu'à 500 personnes selon la configuration.
            Nous adaptons la disposition, la sonorisation et le service à votre événement.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Chaque demande fait l'objet d'un devis sur mesure, avec un interlocuteur unique du premier
            échange jusqu'à la fin de la soirée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/evenementiel"
              className="premium-button bg-gradient-gold text-primary-foreground px-7 py-3 text-center font-medium"
            >
              Voir la page événementiel
            </Link>
            <a
              href={whatsappLink(DEVIS_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button border border-primary/50 text-primary px-7 py-3 text-center"
            >
              Demander un devis
            </a>
          </div>
        </Reveal>
      </section>

      {/* Restaurant */}
      <section className="bg-card/40 border-y border-primary/10">
        <div className="container py-20 sm:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <Reveal className="lg:order-2">
            <img
              src={restaurantTable}
              alt="Table dressée au Prince Palace, assiette gastronomique et lumière chaleureuse"
              width={1600}
              height={1072}
              loading="lazy"
              className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
            />
          </Reveal>
          <Reveal delay={120} className="lg:order-1">
            <Utensils className="h-7 w-7 text-primary mb-5" />
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Le restaurant</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Une cuisine généreuse servie tard, dans une salle feutrée à deux pas de l'avenue.
              Idéal pour un dîner à deux comme pour une tablée d'amis avant la soirée.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              La carte complète est présentée sur notre site dédié.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/restaurant"
                className="premium-button border border-primary/50 text-primary px-7 py-3 text-center"
              >
                Découvrir le restaurant
              </Link>
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground px-7 py-3 text-center font-medium"
              >
                Réserver une table
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Adresse */}
      <section className="container py-20 sm:py-28 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <img
            src={privatisation}
            alt="Grande table dressée pour une privatisation au Prince Palace Paris"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>
        <Reveal delay={120}>
          <MapPin className="h-7 w-7 text-primary mb-5" />
          <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Une adresse Champs-Élysées</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {SITE.addressPrimary} — entrée également au {SITE.addressSecondary}. Métro George V et
            Franklin D. Roosevelt à quelques minutes à pied, parkings à proximité immédiate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/contact"
              className="premium-button border border-primary/50 text-primary px-7 py-3 text-center"
            >
              Nous contacter
            </Link>
            <a
              href={SITE.phoneHref}
              className="premium-button bg-gradient-gold text-primary-foreground px-7 py-3 text-center font-medium"
            >
              {SITE.phone}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
