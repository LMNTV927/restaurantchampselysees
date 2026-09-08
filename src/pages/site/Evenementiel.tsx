import { Link } from "react-router-dom";
import { Cake, Glasses, Users, Building2, Crown, PartyPopper, Check } from "lucide-react";
import { eventVenueSchema } from "@/lib/structuredData";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";
import eventSoiree from "@/assets/site/event-soiree.jpg";
import privatisation from "@/assets/site/privatisation.jpg";
import heroLounge from "@/assets/site/hero-lounge.jpg";
import restaurantTable from "@/assets/site/restaurant-table.jpg";

const types = [
  {
    icon: PartyPopper,
    title: "Soirées privées",
    text: "Espace réservé, playlist adaptée et service dédié pour recevoir vos invités jusque tard dans la nuit.",
  },
  {
    icon: Cake,
    title: "Anniversaires",
    text: "Table décorée, arrivée en fanfare, gâteau et bouteilles présentées : une célébration marquante.",
  },
  {
    icon: Glasses,
    title: "EVJF & EVG",
    text: "Formules groupe combinant dîner soigné et ambiance festive, avec un espace qui vous est réservé.",
  },
  {
    icon: Building2,
    title: "Entreprises & team building",
    text: "Dîners d'équipe, lancements, afterworks et cocktails professionnels dans un cadre haut de gamme.",
  },
  {
    icon: Users,
    title: "Cocktails dînatoires",
    text: "Buffet debout, pièces salées et sucrées, bar dédié : idéal pour recevoir de 50 à 300 personnes.",
  },
  {
    icon: Crown,
    title: "Privatisation totale",
    text: "L'établissement entier pour votre événement, jusqu'à 500 personnes, avec scénographie sur mesure.",
  },
];

const espaces = [
  {
    name: "Le Salon Prince",
    image: eventSoiree,
    alt: "Le Salon Prince, espace privatisable du Prince Palace aux Champs-Élysées",
    text: "Le cœur du lieu : banquettes profondes, lumière tamisée et scène centrale pour les soirées qui se prolongent.",
    cocktail: "jusqu'à 300 personnes",
    diner: "jusqu'à 160 convives",
  },
  {
    name: "La Mezzanine",
    image: privatisation,
    alt: "La Mezzanine du Prince Palace, espace en surplomb pour événements privés",
    text: "En surplomb de la salle, un espace à part pour recevoir vos invités sans quitter l'ambiance générale.",
    cocktail: "jusqu'à 120 personnes",
    diner: "jusqu'à 70 convives",
  },
  {
    name: "L'Écrin",
    image: restaurantTable,
    alt: "L'Écrin, salon intime du Prince Palace pour dîners privés à Paris 8",
    text: "Un salon intime pour les dîners de famille, les anniversaires en comité restreint et les repas d'affaires.",
    cocktail: "jusqu'à 60 personnes",
    diner: "jusqu'à 40 convives",
  },
];


const formules = [
  {
    name: "Espace réservé",
    from: "À partir de 10 personnes",
    items: ["Zone dédiée dans la salle", "Menu groupe ou à la carte", "Accueil personnalisé", "Décoration de table"],
  },
  {
    name: "Privatisation partielle",
    from: "De 50 à 150 personnes",
    items: [
      "Lounge ou mezzanine privatisé",
      "Formule dîner ou cocktail",
      "Sonorisation dédiée",
      "Coordinateur sur place",
    ],
    highlight: true,
  },
  {
    name: "Privatisation totale",
    from: "Jusqu'à 500 personnes",
    items: [
      "Établissement entier",
      "Scénographie et éclairage sur mesure",
      "Équipe complète dédiée",
      "Horaires étendus",
    ],
  },
];

export default function Evenementiel() {
  const jsonLd = eventVenueSchema({
    description:
      "Lieu événementiel à Paris 8 : soirées privées, anniversaires, EVJF, cocktails d'entreprise et privatisation jusqu'à 500 personnes.",
  });

  return (
    <>
      <Seo
        title="Événementiel Paris 8 | Privatisation Champs-Élysées — Prince Palace"
        description="Soirée privée, anniversaire, EVJF, team building ou privatisation aux Champs-Élysées : jusqu'à 500 personnes. Devis événementiel sur mesure à Paris 8."
        path="/evenementiel"
        jsonLd={jsonLd}
      />

      <HeroSection image={eventSoiree} alt="Soirée privée organisée au Prince Palace à Paris" priority>
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Événementiel Paris
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Organisez votre événement privé aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            De la tablée d'amis à la privatisation complète jusqu'à 500 personnes, nous construisons
            votre soirée sur mesure, dans un cadre noir et or au cœur du 8e arrondissement.
          </p>
          <a
            href={whatsappLink(DEVIS_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander un devis événementiel
          </a>
        </div>
      </HeroSection>

      {/* Nos espaces */}
      <section className="py-20 sm:py-28">
        <Reveal className="container text-center max-w-xl mx-auto mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-[11px] mb-4">Nos espaces</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-light">
            Trois lieux, trois atmosphères
          </h2>
        </Reveal>

        <div className="space-y-16 sm:space-y-24">
          {espaces.map((espace, i) => (
            <Reveal key={espace.name}>
              <div
                className={`container grid lg:grid-cols-2 gap-8 lg:gap-14 items-center ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <img
                  src={espace.image}
                  alt={espace.alt}
                  width={1600}
                  height={1072}
                  loading="lazy"
                  className="w-full object-cover aspect-[4/3]"
                />
                <div>
                  <h3 className="font-playfair text-3xl font-light mb-4">{espace.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{espace.text}</p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-8">
                    <li>
                      <span className="text-primary uppercase tracking-[0.2em] text-[11px] mr-2">Cocktail</span>
                      {espace.cocktail}
                    </li>
                    <li>
                      <span className="text-primary uppercase tracking-[0.2em] text-[11px] mr-2">Dîner assis</span>
                      {espace.diner}
                    </li>
                  </ul>
                  <a
                    href={whatsappLink(DEVIS_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border border-primary/50 text-primary px-7 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Demander un devis
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>



      <section className="container py-20 sm:py-28">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Types d'événements</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Chaque occasion a sa mise en scène</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((t, i) => (
            <Reveal key={t.title} delay={i * 70}>
              <article className="premium-card h-full p-7 border-primary/15 hover:border-primary/40 hover:shadow-gold transition-all duration-500">
                <t.icon className="h-7 w-7 text-primary mb-5" />
                <h3 className="font-playfair text-xl mb-3">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-card/40 border-y border-primary/10">
        <div className="container py-20 sm:py-28">
          <Reveal className="max-w-2xl mb-14">
            <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Nos formules</p>
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Trois façons de nous privatiser</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les tarifs dépendent de la date, du nombre d'invités et de la formule choisie. Nous vous
              répondons avec une proposition chiffrée détaillée.
            </p>
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {formules.map((f, i) => (
              <Reveal key={f.name} delay={i * 90}>
                <article
                  className={`premium-card h-full p-8 transition-all duration-500 ${
                    f.highlight ? "border-primary/50 shadow-gold" : "border-primary/15"
                  }`}
                >
                  <h3 className="font-playfair text-2xl mb-2">{f.name}</h3>
                  <p className="text-primary text-sm mb-6">{f.from}</p>
                  <ul className="space-y-3">
                    {f.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 sm:py-28 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <img
            src={privatisation}
            alt="Salle privatisée du Prince Palace dressée pour un dîner d'entreprise"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Capacité et ambiance</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Jusqu'à 500 personnes en configuration cocktail, environ 250 convives assis. Plusieurs
            espaces distincts permettent d'accueillir un petit groupe sans perdre l'intimité, ou de
            recevoir un événement d'ampleur.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Lumière tamisée, matières profondes, touches dorées : une atmosphère lounge qui met en
            valeur vos photos et vos vidéos de soirée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/galerie" className="premium-button border border-primary/50 text-primary px-7 py-3 text-center">
              Voir la galerie
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

      <section className="border-t border-primary/10 bg-gradient-subtle">
        <div className="container py-20 text-center">
          <Reveal>
            <img
              src={heroLounge}
              alt="Ambiance lounge du Prince Palace aux Champs-Élysées"
              width={1920}
              height={1088}
              loading="lazy"
              className="rounded-2xl w-full object-cover h-48 sm:h-64 mb-12 border border-primary/20"
            />
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Parlons de votre événement</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Dites-nous la date, le nombre d'invités et le type d'occasion : nous revenons vers vous
              avec une proposition adaptée.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(DEVIS_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis événementiel
              </a>
              <Link
                to="/contact"
                className="premium-button border border-primary/50 text-primary px-8 py-4"
              >
                Nous contacter
              </Link>
            </div>
            <img
              src={restaurantTable}
              alt="Détail d'une table dressée au Prince Palace"
              width={1600}
              height={1072}
              loading="lazy"
              className="sr-only"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
