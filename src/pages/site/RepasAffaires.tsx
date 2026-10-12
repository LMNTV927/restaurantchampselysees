import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/detail-table.jpg";
import table from "@/assets/site/restaurant-table.jpg";

const AFFAIRES_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un repas d'affaires. Date souhaitée : ... / Nombre de convives : ... / Format (dîner assis, cocktail dînatoire) : ... / Contraintes (table ronde, présentation, allergies) : ...";

const faq = [
  {
    q: "Le Prince Palace propose-t-il des déjeuners d'affaires ?",
    a: "Non : l'établissement ouvre à 17h. Les repas d'affaires se tiennent donc en soirée, sous forme de dîner. La réservation en ligne fonctionne par créneaux de 30 minutes à partir de 17h, ce qui permet de caler précisément l'heure d'arrivée de vos invités.",
  },
  {
    q: "Combien de convives peut accueillir un dîner d'affaires ?",
    a: "Le lieu compte environ 250 places assises et jusqu'à 500 personnes en configuration cocktail. Un espace dédié est réservé dès 10 convives, la privatisation partielle convient de 50 à 150 personnes et la privatisation totale ouvre l'ensemble du restaurant.",
  },
  {
    q: "Peut-on réserver une simple table pour un repas d'affaires de quatre personnes ?",
    a: "Oui. Pour un petit comité, une table est réservée directement en ligne, sans passer par un devis. Au-delà de 10 convives, une demande de devis permet de définir le placement, le menu et le déroulé de la soirée.",
  },
  {
    q: "Jusqu'à quelle heure un repas d'affaires peut-il se prolonger ?",
    a: "Du lundi au mercredi, la salle ferme à minuit : le dîner reste cadré sur la soirée. Du jeudi au dimanche, l'établissement reste ouvert jusqu'à 5h, avec une ambiance club et DJ à partir de minuit pour les groupes qui souhaitent poursuivre les échanges.",
  },
  {
    q: "Où se trouve l'entrée et comment venir ?",
    a: "Le Prince Palace se situe au 76 avenue des Champs-Élysées, avec une entrée à l'angle au 59 rue de Ponthieu, Paris 8e. Après 22h, l'accès se fait par le 59 rue de Ponthieu. Les métros George V et Franklin D. Roosevelt sont à quelques minutes, ainsi que plusieurs parkings publics.",
  },
  {
    q: "Une prise de parole ou une présentation est-elle possible pendant le dîner ?",
    a: "Les besoins techniques (écran, sonorisation, micros, connexion) sont validés avec l'équipe lors de la demande de devis, afin de vous dire précisément ce qui est disponible sur place. Un prestataire extérieur peut également être accueilli pour installer un matériel spécifique.",
  },
];

const formats = [
  {
    title: "Une table de 2 à 4 convives",
    text: "Un déjeuner qui devient dîner : vous recevez un client, un partenaire ou un candidat autour d'une table calme, dans une salle lounge où l'on s'entend parler. La réservation en ligne suffit, par créneau de 30 minutes.",
  },
  {
    title: "Un groupe de 6 à 10 convives",
    text: "Un espace dédié est réservé à votre groupe dès 10 personnes : votre table reste entre vous, sans privatiser tout l'établissement. C'est le format courant d'un dîner de service, d'un comité de direction ou d'un repas de fin de négociation.",
  },
  {
    title: "Un repas d'affaires élargi, de 50 à 150 invités",
    text: "La privatisation partielle réunit vos clients, partenaires et équipes dans un espace identifié, avec la restauration à proximité immédiate et la possibilité de prolonger la soirée sur place.",
  },
  {
    title: "Plus de 150 convives",
    text: "La privatisation totale consacre l'ensemble du lieu à votre entreprise : jusqu'à 500 personnes en cocktail et environ 250 convives assis, pour une soirée de fin d'année ou un anniversaire de société.",
  },
];

const creneaux = [
  "Lundi à mercredi — la salle ferme à minuit : un dîner d'affaires qui se termine entre 22h et 23h, sans soirée qui s'éternise",
  "Jeudi à dimanche — ouverture jusqu'à 5h : dîner, puis ambiance club avec DJ à partir de minuit",
  "Après 22h — l'entrée se fait par le 59 rue de Ponthieu, ce qui simplifie l'arrivée tardive de vos invités",
  "Créneaux de 30 minutes — la réservation en ligne permet de fixer une heure d'arrivée précise pour tout le monde",
];

export default function RepasAffaires() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Repas d'affaires à Paris 8e : le dîner d'affaires aux Champs-Élysées",
      description:
        "Repas d'affaires à Paris 8e : table réservable aux Champs-Élysées pour un dîner d'affaires dès 17h, de 2 à 500 convives, et soirée jusqu'à 5h du jeudi au dimanche.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/repas-affaires-restaurant-paris",
    },
    {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Prince Palace",
      address: {
        "@type": "PostalAddress",
        streetAddress: "76 Avenue des Champs-Élysées",
        postalCode: "75008",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
      telephone: "+33 1 59 13 32 68",
      url: "https://restaurantchampselysees.fr/repas-affaires-restaurant-paris",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    },
  ];

  return (
    <>
      <Seo
        title="Dîner d'affaires à Paris 8e : restaurant Champs-Élysées"
        description="Repas d'affaires à Paris 8e : table aux Champs-Élysées dès 17h, de 2 à 500 convives, jusqu'à 5h du jeudi au dimanche. Devis pour les groupes."
        path="/repas-affaires-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Table dressée au Prince Palace pour un repas d'affaires aux Champs-Élysées à Paris 8e"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Entreprises</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Repas d'affaires à Paris 8e : dîner d'affaires aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Une table soignée à deux pas du rond-point des Champs-Élysées pour recevoir un client,
            un partenaire ou votre équipe — dès 17h, de 2 à 500 convives.
          </p>
          <a
            href={whatsappLink(AFFAIRES_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander une proposition
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ici, le repas d'affaires se prend en début de soirée
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le Prince Palace ouvre ses portes à 17h. Autant le dire clairement : il n'y a pas de
            déjeuner d'affaires dans cet établissement. Le rendez-vous professionnel se tient en fin
            de journée, sous forme de dîner, et c'est souvent un avantage. Les agendas de vos
            interlocuteurs se sont libérés, personne ne surveille l'heure pour rentrer au bureau, et
            une conversation qui démarre à 19h peut se poursuivre sans être interrompue.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour recevoir dans de bonnes conditions, trois éléments comptent : une table où l'on
            s'entend parler, un service qui laisse du temps entre les plats, et une adresse que tout
            le monde rejoint sans hésiter. Le reste — placement, menu, ambiance — se règle au moment
            de la réservation.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Le cadre joue aussi son rôle. Un dîner d'affaires dans un restaurant lounge est moins
            formel qu'une salle de réunion d'hôtel, plus vivant qu'un bureau, et l'échange y gagne
            souvent en naturel. À partir de minuit, du jeudi au dimanche, la salle bascule en
            ambiance club avec DJ pour les groupes qui veulent finir la soirée ensemble.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            De la table de deux au dîner d'entreprise de 200 personnes
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Le format se choisit en fonction du nombre de convives. Une réunion à deux, un comité et
            un dîner client ne se préparent pas de la même manière.
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
            Ce que change une adresse aux Champs-Élysées
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Dans un repas professionnel, l'adresse fait partie du message. Recevoir au 76 avenue des
            Champs-Élysées, à l'angle de la rue de Ponthieu, évite les explications interminables par
            téléphone : les métros George V et Franklin D. Roosevelt sont à quelques minutes,
            plusieurs parkings publics se trouvent à proximité, et vos invités venus de province ou
            de l'étranger situent immédiatement le quartier.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un dîner qui se prolonge sur place présente un second avantage : il n'y a pas de course
            au taxi en fin de soirée ni de second établissement à trouver. Vos convives restent dans
            la même salle, le service suit, et la tablée peut se recomposer librement au fil de la
            soirée — un point précieux lorsqu'un même repas réunit plusieurs interlocuteurs.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Côté facturation, la question la plus fréquente concerne le format : menu assis à table,
            cocktail dînatoire debout ou combinaison des deux. Les trois se pratiquent ici, avec des
            propositions chiffrées construites à partir de votre budget et du nombre de convives.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Choisir la bonne date et le bon créneau</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            L'horaire de fermeture change la nature de la soirée. C'est le premier critère à
            regarder avant de fixer une date de rendez-vous professionnel.
          </p>
          <ul className="space-y-3 mb-8">
            {creneaux.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
          <img
            src={table}
            alt="Table ronde dressée pour un dîner d'affaires dans un restaurant des Champs-Élysées"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Préparer la demande : les cinq informations à donner
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Une proposition juste se construit sur des informations précises. Date envisagée, nombre
            de convives, format souhaité (dîner assis ou cocktail), contraintes de placement (table
            ronde, tables séparées, discrétion) et besoins matériels : c'est l'essentiel. Ajoutez les
            régimes particuliers et les allergènes, l'équipe en tient compte.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour un groupe de moins de 10 personnes, aucune démarche particulière : une table est
            réservée directement en ligne sur notre site. Au-delà, une demande de devis par WhatsApp
            permet de valider le menu, le placement et l'heure de fin de soirée. Vous recevez une
            proposition détaillée avant toute confirmation.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour cadrer un format plus large, vous pouvez consulter nos pages{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise
            </Link>
            ,{" "}
            <Link to="/seminaire-entreprise-restaurant-paris" className="text-primary hover:underline">
              séminaire
            </Link>{" "}
            et{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation
            </Link>
            . La page{" "}
            <Link to="/restaurant" className="text-primary hover:underline">
              restaurant
            </Link>{" "}
            présente l'établissement et ses horaires.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Repas d'affaires : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`repas-affaires-faq-${i}`} className="border-primary/15">
                <AccordionTrigger className="text-left font-playfair text-lg">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <section className="border-t border-primary/10 bg-gradient-subtle">
        <div className="container py-20 text-center">
          <Reveal>
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">
              Recevez vos clients aux Champs-Élysées
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Dites-nous la date, le nombre de convives et le format : vous recevez une proposition
              chiffrée, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(AFFAIRES_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis
              </a>
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
