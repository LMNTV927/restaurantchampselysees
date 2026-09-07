import { Link } from "react-router-dom";
import { Seo } from "@/components/Site/Seo";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";
import heroLounge from "@/assets/site/hero-lounge.jpg";
import eventSoiree from "@/assets/site/event-soiree.jpg";
import restaurantTable from "@/assets/site/restaurant-table.jpg";
import privatisation from "@/assets/site/privatisation.jpg";
import { DISH_IMAGES } from "@/lib/dishImages";

const photos = [
  { src: heroLounge, alt: "Salle lounge du Prince Palace aux Champs-Élysées, décor noir et or", span: "sm:col-span-2 sm:row-span-2" },
  { src: eventSoiree, alt: "Soirée privée au Prince Palace avec service de champagne", span: "" },
  { src: privatisation, alt: "Grande table dressée pour une privatisation au Prince Palace", span: "" },
  { src: restaurantTable, alt: "Table dressée du restaurant Prince Palace à Paris 8", span: "sm:col-span-2" },
  ...DISH_IMAGES.map((d, i) => ({
    src: d.src,
    alt: `Plat servi au Prince Palace, Champs-Élysées — vue ${i + 1}`,
    span: "",
  })),
];

export default function Galerie() {
  return (
    <>
      <Seo
        title="Galerie photos | Prince Palace, lounge événementiel Paris 8"
        description="Découvrez en images la salle, les soirées privées et la table du Prince Palace, restaurant lounge événementiel des Champs-Élysées à Paris."
        path="/galerie"
      />

      <section className="container pt-32 sm:pt-40 pb-14">
        <Reveal className="max-w-2xl">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Galerie</p>
          <h1 className="font-playfair text-4xl sm:text-5xl mb-5">Le lieu, les soirées, la table</h1>
          <p className="text-muted-foreground leading-relaxed">
            Un aperçu de l'atmosphère du Prince Palace : salle feutrée, célébrations et dressages
            soignés, au cœur des Champs-Élysées.
          </p>
        </Reveal>
      </section>

      <section className="container pb-20 sm:pb-28">
        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-3 sm:gap-4">
          {photos.map((photo, i) => (
            <Reveal key={`${photo.src}-${i}`} delay={i * 50} className={photo.span}>
              <img
                src={photo.src}
                alt={photo.alt}
                loading={i < 2 ? "eager" : "lazy"}
                className="h-full w-full object-cover rounded-2xl border border-primary/20 hover:scale-[1.02] transition-transform duration-500"
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/10 bg-gradient-subtle">
        <div className="container py-20 text-center">
          <Reveal>
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Envie de ce décor pour votre soirée ?</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <a
                href={whatsappLink(DEVIS_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis événementiel
              </a>
              <Link to="/evenementiel" className="premium-button border border-primary/50 text-primary px-8 py-4">
                Voir l'événementiel
              </Link>
              <a href={SITE.bookingPath} className="premium-button border border-primary/50 text-primary px-8 py-4">
                Réserver une table
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
