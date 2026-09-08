import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";
import { DISH_IMAGES } from "@/lib/dishImages";
import heroLounge from "@/assets/site/hero-lounge.jpg";
import heroLoop from "@/assets/hero-loop.mp4.asset.json";
import heroLoopWebm from "@/assets/hero-loop.webm.asset.json";
import eventSoiree from "@/assets/site/event-soiree.jpg";
import restaurantTable from "@/assets/site/restaurant-table.jpg";
import privatisation from "@/assets/site/privatisation.jpg";
import detailTable from "@/assets/site/detail-table.jpg";
import vibe1 from "@/assets/site/vibe-1.jpg";
import vibe2 from "@/assets/site/vibe-2.jpg";
import vibe3 from "@/assets/site/vibe-3.jpg";

const VIBES = [
  { src: vibe1, alt: "Table d'invités trinquant au champagne dans la salle du Prince Palace" },
  { src: vibe2, alt: "Assiette gastronomique servie au Prince Palace, Paris 8" },
  { src: vibe3, alt: "Anniversaire célébré au Prince Palace, bouteille et ambiance festive" },
];

const ESPACES = [
  {
    name: "Le Salon Prince",
    image: eventSoiree,
    alt: "Le Salon Prince, grande salle événementielle du Prince Palace aux Champs-Élysées",
    p1: "Notre plus grand espace, au cœur du lieu : scène, piste centrale et service dédié pour vos plus grandes soirées.",
    p2: "Jusqu'à 300 personnes en cocktail, 160 en dîner assis, avec disposition et sonorisation adaptées à votre événement.",
  },
  {
    name: "La Mezzanine",
    image: privatisation,
    alt: "La Mezzanine privatisée du Prince Palace, espace intimiste noir et or",
    p1: "Un espace surélevé, plus intime, qui domine la salle : parfait pour un anniversaire ou un dîner d'entreprise.",
    p2: "Jusqu'à 120 personnes en cocktail, 70 en dîner assis, privatisable seul ou avec le salon principal.",
  },
];

export default function Home() {
  const jsonLd = [
    restaurantSchema({
      description:
        "Restaurant lounge et lieu événementiel aux Champs-Élysées : soirées privées, anniversaires, cocktails et privatisation à Paris 8.",
    }),
    eventVenueSchema({
      name: "Prince Palace — lieu événementiel Champs-Élysées",
    }),
  ];

  return (
    <>
      <Seo
        title="Prince Palace | Événementiel & restaurant lounge Champs-Élysées"
        description="Soirées privées, anniversaires, EVJF, cocktails et privatisation aux Champs-Élysées. Restaurant lounge haut de gamme à Paris 8. Réservation en ligne."
        path="/"
        jsonLd={jsonLd}
      />

      {/* 1 — HERO (vidéo en boucle en fond) */}
      <HeroSection
        image={heroLounge}
        video={heroLoop.url}
        videoWebm={heroLoopWebm.url}
        alt="Salle du Prince Palace, lounge noir et or aux Champs-Élysées"
        priority
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-playfair text-5xl sm:text-7xl lg:text-8xl font-light tracking-[0.04em] leading-tight">
            Prince Palace
          </h1>
          <p className="uppercase tracking-[0.5em] text-primary text-[10px] sm:text-xs mt-5 pl-[0.5em]">
            Restaurant &amp; Lounge
          </p>
          <p className="uppercase tracking-[0.5em] text-foreground/70 text-[10px] sm:text-xs mt-2 pl-[0.5em]">
            Paris
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <a href={SITE.bookingPath} className="pill">
              Réserver une table
            </a>
            <a href={whatsappLink(DEVIS_MESSAGE)} target="_blank" rel="noopener noreferrer" className="pill-outline">
              Devis événementiel
            </a>
          </div>
        </div>
      </HeroSection>

      {/* 2 — INTRODUCTION (fond ivoire) */}
      <section className="section-light">
        <div className="container py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <h2 className="display text-4xl sm:text-6xl">
              <span className="text-primary block">Votre soirée d'exception</span>
              <span className="block">au cœur des Champs-Élysées</span>
            </h2>
            <p className="muted-text mt-8 leading-relaxed">
              À deux pas de l'avenue, le Prince Palace réunit un restaurant élégant et un lounge festif dans un
              même lieu. Une salle feutrée, un service attentif et une cuisine généreuse servie tard le soir.
            </p>
            <p className="muted-text mt-4 leading-relaxed">
              Dîner à deux, tablée d'amis ou soirée privée jusqu'à 500 personnes : chaque configuration est
              pensée avec vous, de l'accueil à la dernière coupe.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <img
              src={detailTable}
              alt="Table dressée au Prince Palace : verres en cristal, bougie et lumière chaude"
              width={1200}
              height={1400}
              loading="lazy"
              className="photo-rounded w-full aspect-[4/5]"
            />
          </Reveal>
        </div>

        <div className="container pb-20 sm:pb-24 text-center">
          <p className="inline-flex items-center gap-2 text-sm muted-text">
            <Clock className="h-4 w-4 text-primary" />
            Ouvert 7j/7 — service du soir à partir de 17h
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <a href={SITE.bookingPath} className="pill">
              Réserver une table
            </a>
            <a href={SITE.restaurantSite} target="_blank" rel="noopener noreferrer" className="pill-outline">
              Découvrir la carte
            </a>
          </div>
        </div>
      </section>

      {/* 3 — BANDE AMBIANCE */}
      <section className="section-light border-t" style={{ borderColor: "hsl(var(--ink) / 0.08)" }}>
        <div className="container py-16 sm:py-20">
          <Reveal className="text-center mb-10">
            <h2 className="display text-3xl sm:text-4xl">
              L'ambiance <span className="text-primary">en images</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {VIBES.map((v, i) => (
              <Reveal key={v.src} delay={i * 80}>
                <img
                  src={v.src}
                  alt={v.alt}
                  width={720}
                  height={1280}
                  loading="lazy"
                  className="photo-rounded w-full aspect-[9/16]"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — EXPÉRIENCES plein écran */}
      {[
        {
          image: restaurantTable,
          alt: "Dîner au restaurant du Prince Palace, table dressée et lumière chaleureuse",
          kicker: "Le restaurant",
          title: "Une cuisine généreuse, servie tard",
          text: "Des assiettes à partager, des classiques revisités et un service qui accompagne la soirée jusqu'au bout de la nuit.",
        },
        {
          image: heroLounge,
          alt: "Ambiance lounge et bar du Prince Palace, lumières tamisées et musique",
          kicker: "Le lounge",
          title: "Cocktails, musique et nuits parisiennes",
          text: "Un bar signature, une sélection de champagnes et une programmation musicale qui fait lever les tables.",
        },
      ].map((exp) => (
        <section key={exp.kicker} className="relative min-h-[70vh] flex items-center">
          <img
            src={exp.image}
            alt={exp.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/75" />
          <div className="container relative text-center max-w-2xl py-24">
            <p className="uppercase tracking-[0.3em] text-primary text-[11px] mb-5">{exp.kicker}</p>
            <h2 className="display text-3xl sm:text-5xl mb-6">{exp.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-9">{exp.text}</p>
            <a href={SITE.bookingPath} className="pill">
              Réserver
            </a>
          </div>
        </section>
      ))}

      {/* 5 — ÉVÉNEMENTIEL (fond noir) */}
      <section className="bg-background">
        <div className="container py-20 sm:py-28">
          <Reveal className="max-w-2xl mb-14">
            <p className="uppercase tracking-[0.3em] text-primary text-[11px] mb-4">Événementiel Paris 8</p>
            <h2 className="display text-4xl sm:text-6xl">Nos espaces privatisables</h2>
          </Reveal>

          <div className="grid gap-10 md:grid-cols-2">
            {ESPACES.map((e, i) => (
              <Reveal key={e.name} delay={i * 100}>
                <article>
                  <img
                    src={e.image}
                    alt={e.alt}
                    width={1600}
                    height={1072}
                    loading="lazy"
                    className={`photo-rounded w-full ${i === 0 ? "aspect-[4/3]" : "aspect-[4/3.4]"}`}
                  />
                  <h3 className="display text-2xl sm:text-3xl text-primary mt-7 mb-4">{e.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">{e.p1}</p>
                  <p className="text-muted-foreground leading-relaxed mb-7">{e.p2}</p>
                  <a
                    href={whatsappLink(DEVIS_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill"
                  >
                    Demander un devis
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <Link to="/evenementiel" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
              Voir toutes nos formules événementielles <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 6 — INSTAGRAM */}
      <section className="section-light">
        <div className="container py-20 sm:py-24">
          <Reveal className="text-center mb-10">
            <h2 className="display text-3xl sm:text-5xl">
              Suivez-nous sur <span className="text-primary">Instagram</span>
            </h2>
          </Reveal>
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x">
            {[...DISH_IMAGES.map((d) => d.src), detailTable].slice(0, 5).map((src, i) => (
              <a
                key={i}
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 snap-start w-40 sm:w-56"
              >
                <img
                  src={src}
                  alt={`Publication Instagram du Prince Palace ${i + 1}`}
                  loading="lazy"
                  className="photo-rounded w-full aspect-square hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="pill">
              Voir le compte
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
