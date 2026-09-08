import { Link } from "react-router-dom";
import { Clock, Flame, Wine, ExternalLink } from "lucide-react";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE } from "@/lib/siteConfig";
import restaurantTable from "@/assets/site/restaurant-table.jpg";
import heroLounge from "@/assets/site/hero-lounge.jpg";
import { DISH_IMAGES } from "@/lib/dishImages";

export default function Restaurant() {
  const jsonLd = restaurantSchema({
    url: `${SITE_URL}/restaurant`,
    description:
      "Restaurant lounge aux Champs-Élysées : cuisine généreuse servie tard, ambiance feutrée, service jusqu'à la nuit.",
  });

  return (
    <>
      <Seo
        title="Restaurant lounge Champs-Élysées | Prince Palace Paris 8"
        description="Dîner tard dans un restaurant lounge des Champs-Élysées : cuisine généreuse, ambiance feutrée, service soigné. Réservez votre table à Paris 8."
        path="/restaurant"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={restaurantTable}
        alt="Table dressée au restaurant Prince Palace aux Champs-Élysées"
        height="min-h-[75vh]"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Le restaurant</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Dîner tard, bien, aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Une salle feutrée, une cuisine généreuse et un service qui continue quand les autres
            ferment. Le dîner devient naturellement une soirée.
          </p>
          <a
            href={SITE.bookingPath}
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Réserver une table
          </a>
        </div>
      </HeroSection>

      <section className="container py-20 sm:py-28 grid gap-6 sm:grid-cols-3">
        {[
          { icon: Flame, title: "Cuisine généreuse", text: "Des assiettes à partager comme des plats signature, préparés à la commande." },
          { icon: Clock, title: "Service tardif", text: "On vous reçoit du début de soirée jusque tard dans la nuit, sans vous presser." },
          { icon: Wine, title: "Bar & champagne", text: "Cocktails maison, sélection de vins et service de bouteilles présenté en salle." },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 80}>
            <article className="premium-card h-full p-7 border-primary/15">
              <item.icon className="h-7 w-7 text-primary mb-5" />
              <h2 className="font-playfair text-xl mb-3">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="bg-card/40 border-y border-primary/10">
        <div className="container py-20 sm:py-28">
          <Reveal className="max-w-2xl mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Un avant-goût de la table</h2>
            <p className="text-muted-foreground leading-relaxed">
              La carte complète, mise à jour au fil des saisons, est présentée sur notre site
              restaurant dédié.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DISH_IMAGES.map((dish, i) => (
              <Reveal key={dish.src} delay={i * 70}>
                <img
                  src={dish.src}
                  alt={`Plat servi au restaurant Prince Palace à Paris — proposition ${i + 1}`}
                  loading="lazy"
                  className="rounded-2xl w-full object-cover aspect-square border border-primary/20 hover:scale-[1.02] transition-transform duration-500"
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <a
              href={SITE.restaurantSite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"
            >
              Voir la carte sur princepalace.fr <ExternalLink className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="container py-20 sm:py-28 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <img
            src={heroLounge}
            alt="Salle du restaurant lounge Prince Palace, décor noir et or"
            width={1920}
            height={1088}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Le dîner, puis la soirée</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Beaucoup de nos tables prolongent le repas jusqu'à la nuit : la lumière baisse, la musique
            monte, la salle change d'ambiance sans que vous ayez à changer d'adresse.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Vous venez à plus de dix, ou pour une occasion particulière ? Notre offre événementielle
            est faite pour cela.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/evenementiel"
              className="premium-button border border-primary/50 text-primary px-7 py-3 text-center"
            >
              Voir l'événementiel
            </Link>
            <a
              href={SITE.bookingPath}
              className="premium-button bg-gradient-gold text-primary-foreground px-7 py-3 text-center font-medium"
            >
              Réserver une table
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
