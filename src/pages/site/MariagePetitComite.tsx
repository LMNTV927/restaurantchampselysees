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
import hero from "@/assets/site/detail-table.jpg";
import assiettes from "@/assets/site/privatisation.jpg";

const MARIAGE_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un dîner de mariage en petit comité. Date souhaitée : ... / Nombre d'invités : ... / Espace dédié ou privatisation : ...";

const formats = [
  {
    title: "Une table en salle",
    text: "Pour une dizaine de proches, une réservation classique suffit : table dressée, menu choisi à l'avance, sans démarche supplémentaire.",
  },
  {
    title: "Un espace dédié",
    text: "À partir de 10 personnes, un coin de la salle peut être réservé pour le groupe, sans le isoler du reste du service du soir.",
  },
  {
    title: "Une privatisation partielle",
    text: "De 50 à 150 invités, une partie du restaurant se privatise : table d'honneur, discours, premières ouvertures de bouteilles, sans la logistique d'une salle de réception classique.",
  },
];

const reperes = [
  "Service du soir uniquement, à partir de 17h : pas de dîner de mariage en journée",
  "Espace dédié dès 10 convives, sans privatisation",
  "Privatisation partielle de 50 à 150 personnes, totale jusqu'à 500",
  "Ambiance club avec DJ à partir de minuit, du jeudi au dimanche",
  "Lundi à mercredi, la soirée reste plus feutrée avec une fermeture à minuit",
];

const faq = [
  {
    q: "Le Prince Palace organise-t-il des mariages complets ?",
    a: "Non, ce n'est pas une salle de réception avec cérémonie et prestataires dédiés. C'est un dîner de mariage en petit comité, pour les proches, avec la possibilité de prolonger en soirée club.",
  },
  {
    q: "Combien d'invités peut-on réunir pour un dîner de mariage ?",
    a: "D'une table de dix à un groupe de 150 en privatisation partielle, et jusqu'à 500 en privatisation totale. Le format dépend du nombre réel de proches à réunir.",
  },
  {
    q: "Peut-on prévoir un discours ou une ouverture de champagne ?",
    a: "Oui, à condition de le signaler lors de la réservation : l'équipe prépare le timing du service en conséquence, surtout pour un espace dédié ou une privatisation.",
  },
  {
    q: "Le dîner de mariage peut-il déboucher sur une soirée dansante ?",
    a: "Du jeudi au dimanche, oui : le DJ prend le relais à partir de minuit et la salle bascule en ambiance club, sans changer de lieu pour les invités.",
  },
  {
    q: "Peut-on apporter une décoration ou un gâteau personnalisé ?",
    a: "Une décoration légère et un gâteau apporté sont possibles en prévenant à la réservation. Pour un habillage plus complet de la table, une privatisation facilite l'installation.",
  },
];

export default function MariagePetitComite() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Mariage en petit comité à Paris : dîner au restaurant",
      description:
        "Organiser un mariage en petit comité à Paris : dîner intime, table dressée, option privatisation et soirée club aux Champs-Élysées. Guide pratique.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/mariage-petit-comite-paris",
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
        title="Mariage en petit comité à Paris : dîner au restaurant"
        description="Organiser un mariage en petit comité à Paris : dîner intime, table dressée, option privatisation et soirée club aux Champs-Élysées. Guide pratique."
        path="/mariage-petit-comite-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Table dressée pour un dîner de mariage en petit comité au restaurant Prince Palace, Champs-Élysées"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Guide pratique
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Mariage en petit comité à Paris : dîner au restaurant
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Pas une salle de réception avec prestataires imposés : un dîner de mariage pour les
            proches, servi à table, avec la possibilité de prolonger la soirée en ambiance club.
          </p>
          <a
            href={whatsappLink(MARIAGE_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander un devis mariage
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Pourquoi un restaurant pour un mariage en petit comité
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Tous les mariages n'ont pas besoin d'une salle de réception avec cérémonie laïque,
            prestataires multiples et logistique sur plusieurs jours. Pour un mariage civil suivi
            d'un dîner entre proches, pour une célébration à l'étranger qu'on fête discrètement à
            Paris, ou pour un second mariage plus intime, un restaurant qui sait recevoir un
            groupe reste la solution la plus simple.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Le Prince Palace reçoit ce type de dîner comme n'importe quel autre événement privé :
            table dressée, menu choisi à l'avance, service dédié, et une salle qui peut, selon le
            jour, prolonger la soirée bien après le dessert.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois formats selon le nombre d'invités
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un mariage en petit comité réunit rarement plus de quelques dizaines de proches. Le
            format se choisit selon ce nombre, pas l'inverse.
          </p>
          <div className="space-y-8">
            {formats.map((f) => (
              <div key={f.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
          <img
            src={assiettes}
            alt="Assiettes dressées pour un dîner de mariage en petit comité, restaurant Prince Palace Paris"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mt-8"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce qu'il faut savoir avant de réserver
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Quelques repères concrets évitent les mauvaises surprises au moment de fixer la date
            et l'heure du dîner.
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
            Du dîner intime à la soirée qui se prolonge
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un dîner de mariage ne se termine pas forcément avec le dessert. Du jeudi au dimanche,
            la salle bascule progressivement en ambiance club à partir de minuit, DJ compris : les
            mariés et leurs proches peuvent enchaîner sans changer d'adresse ni réorganiser le
            transport des invités en fin de soirée.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Les lundis, mardis et mercredis, la soirée reste plus feutrée et s'arrête à minuit —
            un rythme qui convient mieux à un dîner familial calme, sans la suite en piste de
            danse.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Préparer le dîner : discours, décoration, gâteau
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Les petites attentions d'un mariage se préparent comme pour tout événement privé : il
            suffit de les signaler à la réservation. Un discours à prévoir dans le déroulé du
            service, une bouteille à ouvrir à un moment précis, un gâteau apporté plutôt que
            commandé — l'équipe ajuste le timing en fonction de ces indications, surtout pour un
            espace dédié ou une privatisation partielle où plusieurs temps forts s'enchaînent.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour un mariage qui réunit plus de 150 proches, la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation totale
            </Link>{" "}
            du lieu, jusqu'à 500 personnes, permet d'organiser l'ensemble de la soirée — dîner,
            discours et piste de danse — sans partager la salle avec d'autres clients. Le lieu se
            trouve au 76 avenue des Champs-Élysées et au 59 rue de Ponthieu, Paris 8e, à quelques
            pas des métros George V et Franklin D. Roosevelt.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Mariage ou autre célébration familiale ?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le même principe s'applique à d'autres célébrations en petit comité : un baptême, des
            fiançailles ou un{" "}
            <Link to="/anniversaire-restaurant-paris" className="text-primary hover:underline">
              anniversaire
            </Link>{" "}
            de mariage se reçoivent de la même façon, avec un espace adapté au nombre réel
            d'invités plutôt qu'une salle surdimensionnée.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour les proches qui veulent prolonger la fête entre eux la veille, la page{" "}
            <Link to="/evjf-paris-champs-elysees" className="text-primary hover:underline">
              EVJF
            </Link>{" "}
            détaille une formule adaptée à une soirée entre amis avant le grand jour.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Mariage en petit comité : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`mariage-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">
              Organisons le dîner de votre mariage
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Indiquez la date, le nombre d'invités et le format envisagé : nous préparons une
              proposition adaptée à votre mariage en petit comité.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Réserver une table
              </a>
              <a
                href={whatsappLink(MARIAGE_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button border border-primary/50 text-primary px-8 py-4"
              >
                Demander un devis mariage
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
