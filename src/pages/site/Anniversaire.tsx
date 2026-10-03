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
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";
import eventSoiree from "@/assets/site/event-soiree.jpg";
import privatisation from "@/assets/site/privatisation.jpg";
import restaurantTable from "@/assets/site/restaurant-table.jpg";

const faqAnniv = [
  {
    q: "Peut-on apporter son propre gâteau d'anniversaire ?",
    a: "Oui. Prévenez-nous lors de la réservation : nous le conservons au frais et le servons au moment choisi, avec les bougies et la présentation qui vont avec.",
  },
  {
    q: "À partir de combien de personnes peut-on réserver pour un anniversaire ?",
    a: "Une simple table pour quelques invités suffit, sans minimum. Au-delà de 10 personnes, nous pouvons réserver un espace dédié dans la salle.",
  },
  {
    q: "Jusqu'à quelle heure peut durer la soirée ?",
    a: "Le service commence à 17h et la soirée peut se prolonger jusqu'à 5h du matin, avec l'ambiance club et le DJ à partir de minuit.",
  },
  {
    q: "Faut-il un acompte pour un anniversaire en groupe ?",
    a: "Pour les petites tables, la réservation en ligne suffit. Pour les groupes et les espaces privatisés, nous établissons une proposition détaillée avant confirmation.",
  },
];

const etapes = [
  {
    title: "1. Choisissez la date et l'heure",
    text: "Les soirées du week-end partent vite : réservez tôt, surtout pour les groupes. Le service démarre à 17h et les dernières arrivées sont possibles tard dans la nuit.",
  },
  {
    title: "2. Dites-nous l'occasion",
    text: "Un anniversaire se prépare : table décorée, gâteau apporté ou commandé, bouteilles présentées, musique adaptée. Indiquez vos envies dans le commentaire de réservation ou par WhatsApp.",
  },
  {
    title: "3. Prévoyez la suite de la soirée",
    text: "Après le dîner, pas besoin de changer de lieu : à partir de minuit, l'ambiance monte et le DJ prend le relais jusqu'à 5h du matin.",
  },
];

export default function Anniversaire() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Fêter son anniversaire dans un restaurant à Paris : le guide pratique",
      description:
        "Comment organiser un anniversaire au restaurant à Paris : choix de la date, gâteau, groupe, privatisation et fin de soirée en ambiance club aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/anniversaire-restaurant-paris",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqAnniv.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <>
      <Seo
        title="Anniversaire restaurant Paris : fêter son anniversaire aux Champs-Élysées"
        description="Organiser un anniversaire au restaurant à Paris : table décorée, gâteau, groupe ou espace privatisé, puis ambiance club jusqu'à 5h. Guide pratique et réservation en ligne."
        path="/anniversaire-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection image={eventSoiree} alt="Anniversaire célébré au restaurant Prince Palace à Paris" priority>
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Guide pratique
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Fêter son anniversaire dans un restaurant à Paris
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Un dîner entre proches, une grande tablée ou une soirée qui se prolonge jusqu'au bout de
            la nuit : voici comment organiser un anniversaire réussi au restaurant, sans stress et
            sans mauvaise surprise.
          </p>
          <a
            href={SITE.bookingPath}
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Réserver une table d'anniversaire
          </a>
        </div>
      </HeroSection>

      {/* Article */}
      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Pourquoi choisir un restaurant pour un anniversaire ?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Fêter son anniversaire au restaurant, c'est s'offrir une soirée sans organisation
            lourde : pas de courses, pas de vaisselle, pas de logistique. Tout le monde est à table
            en même temps, le service suit, et chacun profite — y compris celui ou celle qui
            organise.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            À Paris, le choix est immense, mais tous les restaurants ne se prêtent pas aux
            anniversaires. Les critères qui comptent vraiment : des horaires qui permettent de
            prolonger la soirée, la possibilité de personnaliser la table, un cadre qui fait de
            belles photos, et une équipe habituée aux célébrations.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Organiser son anniversaire en trois étapes
          </h2>
          <div className="space-y-8">
            {etapes.map((e) => (
              <div key={e.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{e.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{e.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <img
            src={restaurantTable}
            alt="Table d'anniversaire dressée au Prince Palace, restaurant des Champs-Élysées"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mb-8"
          />
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Petite table ou grand groupe ?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour un anniversaire en comité restreint, une simple réservation en ligne suffit :
            indiquez l'occasion en commentaire et l'équipe prépare la table en conséquence.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            À partir d'une dizaine d'invités, il devient intéressant de réserver un espace dédié.
            Au Prince Palace, trois configurations existent : un espace réservé dans la salle, une
            privatisation partielle (de 50 à 150 personnes) ou la privatisation totale du lieu,
            jusqu'à 500 personnes.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Table décorée et accueil personnalisé",
              "Gâteau apporté ou organisé sur place",
              "Bouteilles présentées à table",
              "Ambiance club avec DJ à partir de minuit",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/evenementiel"
            className="inline-block border border-primary/50 text-primary px-7 py-3 text-[11px] uppercase tracking-[0.25em] hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Voir les formules de privatisation
          </Link>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Un anniversaire aux Champs-Élysées
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le cadre compte autant que le menu. Au 34 avenue des Champs-Élysées, le Prince Palace
            combine un restaurant lounge noir et or, un service qui démarre à 17h et une ambiance
            qui monte progressivement jusqu'à 5h du matin. L'anniversaire commence autour d'un
            dîner et se termine sur le dancefloor, sans changer d'adresse.
          </p>
          <img
            src={privatisation}
            alt="Salle du Prince Palace privatisable pour un anniversaire à Paris 8"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>
      </article>

      {/* FAQ */}
      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Anniversaire au restaurant : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqAnniv.map((item, i) => (
              <AccordionItem key={i} value={`anniv-faq-${i}`} className="border-primary/15">
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

      {/* CTA */}
      <section className="border-t border-primary/10 bg-gradient-subtle">
        <div className="container py-20 text-center">
          <Reveal>
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Votre anniversaire commence ici</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Réservez votre table en ligne en quelques clics, ou écrivez-nous pour un anniversaire
              en groupe ou une privatisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Réserver une table
              </a>
              <a
                href={whatsappLink(DEVIS_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button border border-primary/50 text-primary px-8 py-4"
              >
                Demander un devis groupe
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
