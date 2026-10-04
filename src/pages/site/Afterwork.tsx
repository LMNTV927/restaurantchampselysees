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

const faqAfterwork = [
  {
    q: "À quelle heure commence l'afterwork ?",
    a: "Le service démarre à 17h, ce qui permet d'arriver directement après le travail. Les réservations sont possibles par créneaux de 30 minutes, et la soirée peut se prolonger jusqu'à 5h du matin.",
  },
  {
    q: "Peut-on venir en groupe pour un afterwork d'entreprise ?",
    a: "Oui. Une simple table suffit pour les petits groupes, et au-delà de 10 personnes nous pouvons réserver un espace dédié dans la salle. Pour les équipes plus importantes, des formules de privatisation existent jusqu'à 500 personnes.",
  },
  {
    q: "Peut-on privatiser un espace pour un afterwork ?",
    a: "Oui, trois configurations sont possibles : un espace réservé dans la salle, une privatisation partielle (de 50 à 150 personnes) ou la privatisation totale du lieu. Nous établissons une proposition détaillée avant confirmation.",
  },
  {
    q: "Y a-t-il de la musique pendant l'afterwork ?",
    a: "L'ambiance est lounge en début de soirée, idéale pour discuter. À partir de minuit, le DJ prend le relais et l'ambiance club monte jusqu'à 5h du matin — sans avoir à changer de lieu.",
  },
];

const atouts = [
  {
    title: "1. Des horaires pensés pour l'après-bureau",
    text: "Ouvert dès 17h, le Prince Palace accueille les afterworks dès la fin de journée. Plus besoin d'attendre 20h pour dîner : arrivez tôt, repartez tard — la maison ferme à 5h du matin.",
  },
  {
    title: "2. Une adresse facile d'accès",
    text: "Au 34 avenue des Champs-Élysées, en plein cœur du 8e arrondissement, l'adresse est simple à rejoindre en métro pour toute l'équipe, quel que soit le bureau de départ.",
  },
  {
    title: "3. Un lieu qui évolue avec la soirée",
    text: "Dîner et discussions en début de soirée, puis ambiance club et DJ à partir de minuit : l'afterwork se transforme en soirée sans changer d'adresse ni payer un second loyer.",
  },
];

export default function Afterwork() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Où faire un afterwork à Paris : dîner, DJ et privatisation aux Champs-Élysées",
      description:
        "Organiser un afterwork à Paris : horaires dès 17h, groupes d'entreprise, espaces privatifs et ambiance club avec DJ jusqu'à 5h aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/afterwork-paris-champs-elysees",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqAfterwork.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <>
      <Seo
        title="Afterwork à Paris : dîner, DJ et privatisation aux Champs-Élysées"
        description="Où faire un afterwork à Paris ? Au Prince Palace, Champs-Élysées : service dès 17h, espaces privatifs pour les entreprises, DJ et ambiance club jusqu'à 5h. Réservation en ligne."
        path="/afterwork-paris-champs-elysees"
        jsonLd={jsonLd}
      />

      <HeroSection image={eventSoiree} alt="Afterwork entre collègues au Prince Palace, Champs-Élysées" priority>
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Guide pratique
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Où faire un afterwork à Paris ?
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Un verre entre collègues, un dîner d'équipe ou une soirée d'entreprise qui se prolonge
            jusqu'au bout de la nuit : voici ce qui fait un afterwork réussi, et pourquoi les
            Champs-Élysées cochent toutes les cases.
          </p>
          <a
            href={SITE.bookingPath}
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Réserver une table d'afterwork
          </a>
        </div>
      </HeroSection>

      {/* Article */}
      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les ingrédients d'un bon afterwork à Paris
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un afterwork réussi tient à peu de choses : des horaires compatibles avec la fin de
            journée, une adresse facile à rejoindre pour tout le monde, de quoi manger et boire
            sans se ruiner, et un cadre qui change du bureau. À Paris, les options ne manquent
            pas, mais peu de lieux combinent tout cela avec la possibilité de prolonger la soirée.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            C'est précisément ce qui distingue un restaurant-club : on y arrive pour un verre et
            un dîner, et on peut y rester lorsque l'ambiance monte — sans déménager toute
            l'équipe vers un second lieu.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Pourquoi le Prince Palace convient aux afterworks
          </h2>
          <div className="space-y-8">
            {atouts.map((e) => (
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
            alt="Table dressée pour un afterwork d'entreprise au Prince Palace, Paris 8"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mb-8"
          />
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Afterwork en équipe ou soirée d'entreprise ?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour un afterwork informel entre collègues, une réservation en ligne suffit :
            indiquez le nombre de personnes et l'occasion en commentaire, l'équipe prépare la
            table en conséquence.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour un dîner d'entreprise, un pot de départ ou une soirée de fin d'année, il devient
            intéressant de réserver un espace dédié. Trois configurations existent : un espace
            réservé dans la salle, une privatisation partielle (de 50 à 150 personnes) ou la
            privatisation totale du lieu, jusqu'à 500 personnes.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Service dès 17h, réservations par créneaux de 30 minutes",
              "Espaces privatifs pour les groupes et les entreprises",
              "DJ et ambiance club à partir de minuit",
              "Ouvert jusqu'à 5h du matin",
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
            Prolonger la soirée sans changer de lieu
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le classique piège de l'afterwork parisien : le bar ferme à 22h, et il faut convaincre
            tout le monde de se déplacer vers une autre adresse. Au Prince Palace, la soirée suit
            un rythme naturel — dîner et discussions jusqu'à minuit, puis le DJ prend le relais et
            l'ambiance club embarque les volontaires jusqu'à 5h du matin.
          </p>
          <img
            src={privatisation}
            alt="Salle du Prince Palace privatisable pour un afterwork ou une soirée d'entreprise à Paris"
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
          <h2 className="font-playfair text-3xl sm:text-4xl">Afterwork à Paris : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqAfterwork.map((item, i) => (
              <AccordionItem key={i} value={`afterwork-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Votre prochain afterwork commence ici</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Réservez votre table en ligne en quelques clics, ou écrivez-nous pour un afterwork
              d'équipe ou une privatisation.
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
