import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/restaurant-table.jpg";
import ambiance from "@/assets/site/vibe-1.jpg";

const EVG_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un EVG. Date souhaitée : ... / Nombre de personnes : ... / Espace dédié ou privatisation : ...";

const etapes = [
  "17h-19h — créneau d'arrivée au choix, table dressée pour toute la bande",
  "Dîner servi — plats à partager, le témoin garde le dernier mot sur l'addition s'il le souhaite",
  "Minuit, du jeudi au dimanche — la salle bascule, DJ et ambiance club prennent le relais",
  "Jusqu'à 5h — ceux qui restent profitent de la piste, sans changer d'adresse",
];

const formats = [
  {
    title: "Table réservée, moins de 10 convives",
    text: "Une réservation classique en ligne suffit : pas de démarche particulière, juste le bon créneau pour que tout le monde arrive ensemble.",
  },
  {
    title: "Espace dédié, dès 10 personnes",
    text: "Un coin de salle réservé pour la bande, avec ses propres tables, sans isoler le groupe du reste du service.",
  },
  {
    title: "Privatisation partielle, de 50 à 150",
    text: "Une partie du lieu mise à disposition pour le groupe seul : utile quand l'EVG réunit aussi la famille ou les collègues proches du futur marié.",
  },
];

const reperes = [
  "Service du soir uniquement à partir de 17h : pas d'option déjeuner ou brunch",
  "Accès par le 59 rue de Ponthieu à partir de 22h, en plus du 76 avenue des Champs-Élysées",
  "Capacité jusqu'à 500 debout, environ 250 convives assis en privatisation totale",
  "Réservation du restaurant non reliée automatiquement à l'accès club : à préciser au devis",
  "Lundi à mercredi, fermeture à minuit : une soirée plus courte et plus calme",
];

const faq = [
  {
    q: "Le Prince Palace organise-t-il des animations ou des défis pour l'EVG ?",
    a: "Non, ce n'est pas une agence d'activités : le lieu fournit le dîner et la soirée club, pas de jeux ni d'animateur. Les éventuels défis entre amis s'organisent en dehors, le restaurant se concentre sur la table et la piste.",
  },
  {
    q: "Peut-on réserver une table surprise sans que le futur marié sache où il va ?",
    a: "Oui, rien n'empêche de garder l'adresse secrète jusqu'à l'arrivée. Signalez-le simplement au moment du devis si le groupe a des demandes particulières liées à la surprise, comme une table à l'écart en arrivant.",
  },
  {
    q: "Combien de temps dure une réservation de table ?",
    a: "Un créneau de réservation correspond à trois heures au restaurant. Pour enchaîner directement sur la soirée club, précisez-le dans la demande de devis plutôt que d'improviser sur place.",
  },
  {
    q: "Un groupe d'une dizaine de personnes doit-il privatiser le lieu ?",
    a: "Non. Dès 10 personnes, un espace dédié suffit, sans les démarches d'une privatisation. La privatisation partielle ou totale ne devient utile qu'au-delà de 50 invités, ou pour garder le groupe totalement entre lui.",
  },
  {
    q: "Peut-on prévoir un forfait boissons pour simplifier l'addition ?",
    a: "Oui, un forfait se cale au devis pour éviter les arbitrages de fin de soirée entre les convives. C'est particulièrement utile quand le témoin centralise le paiement pour tout le groupe.",
  },
];

export default function Evg() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "EVG à Paris : dîner entre potes et soirée club aux Champs-Élysées",
      description:
        "Organiser un EVG à Paris : dîner dès 17h, espace dédié dès 10 personnes, DJ et club jusqu'à 5h au Prince Palace, Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/evg-restaurant-paris",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <>
      <Seo
        title="EVG à Paris : dîner et soirée club aux Champs-Élysées"
        description="Organiser un EVG à Paris : dîner dès 17h, espace dédié dès 10 personnes, DJ et club jusqu'à 5h au Prince Palace, Champs-Élysées."
        path="/evg-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Planche à partager servie pour un dîner d'EVG au restaurant Prince Palace, Champs-Élysées"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Guide pratique
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            EVG à Paris aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Un dîner entre potes, puis la salle qui bascule en soirée club : pas besoin de changer
            d'adresse entre le repas et la piste.
          </p>
          <a
            href={whatsappLink(EVG_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Organiser l'EVG
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Un format simple, sans logistique superflue
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Organiser un EVG tient souvent en une poignée de questions pratiques : où dîner, qui
            paie quoi, et comment enchaîner sur une soirée sans transporter dix personnes d'un
            quartier à l'autre. Le Prince Palace répond aux trois en un seul lieu, au 76 avenue
            des Champs-Élysées : un dîner servi à table, suivi d'une ambiance club pour ceux qui
            restent.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Ce n'est pas une agence d'activités avec défis chronométrés ou animateur dédié : c'est
            un restaurant qui sait recevoir un groupe d'amis et une salle qui continue la soirée
            une fois le dessert terminé. Le témoin n'a qu'un seul interlocuteur à gérer, de la
            réservation de la table jusqu'au dernier verre de la nuit, ce qui simplifie
            sensiblement l'organisation quand les invités viennent de plusieurs villes.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Le déroulé d'une soirée EVG
          </h2>
          <ul className="space-y-3 mb-8">
            {etapes.map((e) => (
              <li key={e} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {e}
              </li>
            ))}
          </ul>
          <img
            src={ambiance}
            alt="Cocktail servi lors d'une soirée EVG au Prince Palace, Paris 8e"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois formats selon la taille de la bande
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un EVG réunit rarement les mêmes effectifs d'un groupe à l'autre : quelques proches
            pour certains, toute une bande élargie à la famille pour d'autres. Le format se choisit
            en fonction, pas l'inverse.
          </p>
          <div className="space-y-8">
            {formats.map((f) => (
              <div key={f.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce que le témoin doit vérifier avant de fixer la date
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Quelques repères concrets évitent les mauvaises surprises au moment de choisir le soir
            et de prévenir le reste de la bande.
          </p>
          <ul className="space-y-3 mb-8">
            {reperes.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Un dîner qui peut rester entre vous, ou s'ouvrir à la nuit
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour une bande qui préfère garder le dîner fermé, sans se mêler au reste de la salle,
            la privatisation partielle isole le groupe pendant tout le service. Pour ceux qui
            veulent au contraire prolonger la soirée dans l'ambiance générale, un espace dédié
            suffit : le groupe dîne ensemble, puis rejoint naturellement la piste commune à partir
            de minuit, du jeudi au dimanche.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Le lieu se trouve au 76 avenue des Champs-Élysées et au 59 rue de Ponthieu, Paris 8e, à
            quelques minutes des métros George V et Franklin D. Roosevelt, avec des parkings
            publics à proximité pour ceux qui viennent en voiture. Un détail pratique à transmettre
            au groupe : à partir de 22h, l'entrée ne se fait plus par l'avenue mais par la rue de
            Ponthieu, ce qui évite une attente inutile devant la mauvaise porte pour les retardataires.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            EVG, EVJF ou simple soirée entre amis
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le même principe s'applique côté{" "}
            <Link to="/evjf-paris-champs-elysees" className="text-primary hover:underline">
              EVJF
            </Link>
            : dîner puis club, sans changer d'adresse. Pour une bascule mieux maîtrisée entre le
            repas et la piste, la page{" "}
            <Link to="/soiree-dansante-paris" className="text-primary hover:underline">
              soirée dansante
            </Link>{" "}
            détaille le déroulé heure par heure.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour une sortie plus courte en semaine, sans viser la nuit entière, voyez aussi la page{" "}
            <Link to="/afterwork-paris-champs-elysees" className="text-primary hover:underline">
              afterwork
            </Link>
            .
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">EVG à Paris : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`evg-faq-${i}`} className="border-primary/15">
                <AccordionTrigger className="text-left font-playfair text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <section className="border-t border-primary/10 bg-gradient-subtle">
        <div className="container py-20 text-center">
          <Reveal>
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Organisons l'EVG au Prince Palace</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, nombre de personnes et format envisagé : demandez votre devis ou réservez
              directement en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Réserver une table
              </a>
              <a
                href={whatsappLink(EVG_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button border border-primary/50 text-primary px-8 py-4"
              >
                Demander un devis EVG
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
