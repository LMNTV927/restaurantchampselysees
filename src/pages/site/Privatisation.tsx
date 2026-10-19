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
import privatisation from "@/assets/site/privatisation.jpg";
import eventSoiree from "@/assets/site/event-soiree.jpg";

const faqPrivatisation = [
  {
    q: "Combien de personnes peut-on recevoir en privatisation ?",
    a: "Le Prince Palace dispose d'une capacité de 500 places. Un espace dédié convient aux groupes à partir de 10 personnes, la privatisation partielle (de 50 à 150 personnes) réserve une partie de la salle, et la privatisation totale ouvre tout le lieu à votre événement.",
  },
  {
    q: "Quel est le budget pour privatiser un restaurant à Paris ?",
    a: "Le budget dépend de la date, du jour de la semaine, du nombre d'invités et de la formule choisie (cocktail, dîner assis, open bar). Chaque demande reçoit une proposition détaillée et personnalisée avant confirmation, sans engagement.",
  },
  {
    q: "Quels types d'événements peut-on privatiser ?",
    a: "Dîners d'entreprise, soirées de fin d'année, lancements de produit, anniversaires, EVJF, réceptions associatives ou soirées privées entre amis : le lieu s'adapte à la fois à un dîner assis et à une soirée dansante avec DJ.",
  },
  {
    q: "Quels sont les horaires d'une privatisation ?",
    a: "L'établissement ouvre à 17h et la soirée peut se prolonger jusqu'à 5h du matin. À partir de 22h, l'accès se fait par le 59 Rue de Ponthieu, ce qui facilite l'installation des équipes techniques et des prestataires en soirée.",
  },
];

const formules = [
  {
    title: "Espace dédié dans la salle",
    text: "À partir de 10 personnes, une zone réservée est dressée pour votre groupe au cœur de la salle. Idéal pour un dîner d'équipe ou un anniversaire sans privatiser tout le lieu.",
  },
  {
    title: "Privatisation partielle",
    text: "De 50 à 150 personnes, une partie du restaurant est fermée pour votre seul événement : cocktail dînatoire, discours, animations, sans perturber le service du reste de la salle.",
  },
  {
    title: "Privatisation totale",
    text: "Jusqu'à 500 personnes, tout le lieu vous appartient : dîner assis, soirée dansante avec DJ, et la possibilité de prolonger la fête jusqu'à 5h du matin.",
  },
];

export default function Privatisation() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Privatiser un restaurant à Paris : 500 places aux Champs-Élysées",
      description:
        "Privatisation de restaurant à Paris : 3 formules (espace dédié, partielle ou totale), capacité de 500 personnes, service dès 17h et DJ jusqu'à 5h aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/privatisation-restaurant-paris",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqPrivatisation.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <>
      <Seo
        title="Privatisation restaurant Paris : 500 places aux Champs-Élysées"
        description="Privatiser un restaurant à Paris : espace dédié dès 10 personnes, privatisation partielle ou totale jusqu'à 500 invités, dîner assis ou soirée avec DJ jusqu'à 5h aux Champs-Élysées."
        path="/privatisation-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection image={privatisation} alt="Salle privatisable au Prince Palace, restaurant aux Champs-Élysées à Paris" priority>
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Privatisation
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Privatiser un restaurant à Paris
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Dîner d'entreprise, anniversaire, EVJF ou soirée privée : réservez un espace dédié,
            une partie du restaurant ou la totalité du lieu, avec dîner servi dès 17h et
            ambiance club jusqu'à 5h du matin.
          </p>
          <a
            href={whatsappLink(DEVIS_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander un devis privatisation
          </a>
        </div>
      </HeroSection>

      {/* Article */}
      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Pourquoi privatiser un restaurant aux Champs-Élysées ?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Privatiser un restaurant à Paris, c'est s'offrir un lieu entier sans gérer la
            logistique : le traiteur, la salle, le son et l'équipe sont déjà en place. Il ne
            reste qu'à inviter. Le choix de l'adresse change tout : aux Champs-Élysées, vos
            invités arrivent à pied ou en métro, et l'image du quartier fait le reste.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le Prince Palace cumule deux atouts rares pour un événement parisien : une capacité
            de 500 places — l'une des plus grandes du quartier — et un format restaurant-club
            qui fait passer naturellement le dîner à la soirée, sans changer d'adresse ni
            négocier une extension à minuit.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois formules de privatisation
          </h2>
          <div className="space-y-8">
            {formules.map((f) => (
              <div key={f.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <img
            src={eventSoiree}
            alt="Soirée privée avec DJ dans un restaurant privatisé à Paris"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mb-8"
          />
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Du dîner assis à la soirée dansante
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La journée commence par un dîner servi dès 17h, avec réservations par créneaux de
            30 minutes pour épouser les horaires de vos invités. Après le dessert, la table se
            transforme en piste : le DJ prend le relais à partir de minuit et l'ambiance club
            s'installe jusqu'à 5h du matin.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Capacité de 500 places sur l'ensemble du lieu",
              "Formules dîner assis, cocktail ou open bar",
              "DJ et sonorisation incluses en soirée",
              "Accès par le 59 Rue de Ponthieu à partir de 22h",
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
            Voir toutes nos formules événementielles
          </Link>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Comment réserver votre privatisation ?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Décrivez-nous votre projet via WhatsApp : date envisagée, nombre d'invités et
            format souhaité. L'équipe revient avec une proposition détaillée — plan de salle,
            formule de restauration, budget — avant toute confirmation. Pour les petits
            groupes (moins de 10 personnes), la réservation en ligne suffit.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour le 31 décembre, découvrez le programme du{" "}
            <a
              href="https://princepalace.fr/reveillon-saint-sylvestre-champs-elysees/"
              target="_blank"
              rel="noopener"
              className="text-primary hover:underline"
            >
              réveillon de la Saint-Sylvestre au Prince Palace
            </a>
            .
          </p>
        </Reveal>
      </article>

      {/* FAQ */}
      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Privatisation à Paris : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqPrivatisation.map((item, i) => (
              <AccordionItem key={i} value={`privatisation-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Privatisez le Prince Palace</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Recevez une proposition personnalisée pour votre événement, ou réservez directement
              votre table en ligne.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(DEVIS_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis
              </a>
              <a
                href={SITE.bookingPath}
                className="premium-button border border-primary/50 text-primary px-8 py-4"
              >
                Réserver une table
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
