import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/detail-table.jpg";
import partage from "@/assets/site/restaurant-table.jpg";

const TEAMBUILDING_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un team building. Date souhaitée : ... / Nombre de collègues : ... / Format (dîner assis ou cocktail debout) : ... / Services représentés : ... / Contraintes alimentaires : ...";

const faq = [
  {
    q: "Combien de collègues faut-il au minimum pour organiser un team building au restaurant ?",
    a: "À partir de dix personnes, un espace dédié est attribué avec tables et assises, ce qui suffit à une tablée unique. En dessous, une simple réservation de table reste possible mais il ne s'agit plus d'un événement d'équipe. Entre 30 et 80 personnes, le format cocktail prend le relais ; au-delà, la privatisation partielle permet de garder le groupe séparé du reste de la salle.",
  },
  {
    q: "Faut-il prévoir une activité type karting ou escape game en plus du repas ?",
    a: "Ce n'est pas indispensable, et c'est parfois contre-productif : une activité d'une heure et demie crée de la mixité sur un temps court, puis chacun retrouve son groupe habituel. Un dîner assis impose deux heures à la même table, ce qui produit un brassage plus lent mais plus durable. Si vous tenez à une animation, elle se place après le repas et se cale avec l'équipe lors du devis.",
  },
  {
    q: "Comment composer les tables pour éviter que les équipes se regroupent entre elles ?",
    a: "Cela se décide avant la soirée, pas pendant. Le plus efficace est de constituer des tables de dix en croisant les services, avec un référent briefé par table qui connaît la composition et relance la conversation. Prévoyez aussi deux places libres par table pour les retardataires, plutôt qu'une table d'appoint au fond de la salle où les derniers arrivants se retrouveraient entre eux.",
  },
  {
    q: "Peut-on recevoir une facture unique pour l'entreprise ?",
    a: "Oui, l'addition est établie pour le groupe et non table par table : c'est justement l'un des avantages d'un événement d'équipe en lieu privatisé. Le budget se fixe à l'avance par personne, avec le menu retenu et un forfait boissons si vous souhaitez un plafond. Ce cadre se décide au devis, ce qui évite les arbitrages délicats en fin de soirée.",
  },
  {
    q: "Le team building peut-il se prolonger après le dîner ?",
    a: "Du jeudi au dimanche, la salle reste ouverte jusqu'à 5h et le DJ démarre à minuit : les collègues qui le souhaitent prolongent sans changer d'adresse. Du lundi au mercredi, la fermeture intervient à minuit, ce qui cadre une soirée plus courte — souvent préférée pour un événement en début de semaine.",
  },
  {
    q: "Comment les participants accèdent-ils au lieu en fin de soirée ?",
    a: "L'adresse principale est le 76 avenue des Champs-Élysées, à Paris 8e, à quelques minutes des métros George V et Franklin D. Roosevelt, avec des parkings publics à proximité. À partir de 22h, l'entrée bascule au 59 rue de Ponthieu : cette information doit figurer dans le message envoyé aux équipes, sinon les retardataires cherchent une porte fermée.",
  },
];

const regles = [
  "Un référent briefé par table : il connaît la composition et relance la conversation quand elle retombe",
  "Jamais deux personnes du même service côte à côte, sauf le référent qui sert de pont entre les métiers",
  "Croiser les niveaux hiérarchiques à l'intérieur de la table, mais éviter le face-à-face entre un manager et son équipe directe",
  "Deux places libres par table pour les retardataires, plutôt qu'une table d'appoint isolée au fond de la salle",
  "Annoncer la composition à l'avance aux intéressés : la surprise d'un voisin inconnu se vit mieux quand elle est préparée",
];

const formats = [
  {
    title: "De 10 à 30 personnes : le dîner assis",
    text: "Une ou deux tablées, un espace dédié dès dix personnes, et deux heures à la même place. C'est le format qui produit le brassage le plus profond, parce que personne ne peut s'échapper vers un autre groupe. Il suppose en revanche d'accepter de ne pas tous se parler : trente collègues répartis sur trois tables ne feront pas tous connaissance le même soir.",
  },
  {
    title: "De 30 à 80 personnes : le cocktail dînatoire debout",
    text: "Debout, les groupes se forment et se défont au fil de la soirée, ce qui mélange vite mais reste en surface. Pour un effectif de cette taille qui se connaît mal, l'astuce consiste à alterner : une heure de cocktail debout, puis un service assis avec des tables composées, puis un retour au debout pour la fin de soirée.",
  },
  {
    title: "De 80 à 250 personnes : la privatisation partielle",
    text: "Une partie identifiée du restaurant est consacrée à l'événement, avec son propre flux de participants, tout en gardant l'accès aux bars. À cette échelle, aucun plan de table ne peut imposer la mixité : elle passe par des sous-groupes de dix avec des référents différents, et par un temps debout suffisamment long avant de passer à table.",
  },
];

const deroule = [
  "17h00 — ouverture, accueil échelonné par créneaux de trente minutes plutôt qu'une arrivée groupée",
  "17h45 — mot d'accueil de cinq minutes, une fois la majorité présente : un discours trop tôt se perd dans les arrivées",
  "18h15 — entrée servie à table, avec la composition croisée décidée à l'avance",
  "19h30 — plat : les tables ont eu le temps de se réchauffer, c'est le moment où les conversations tiennent seules",
  "21h00 — dessert puis passage debout, la partie où les participants circulent réellement entre les groupes",
  "22h00 — accès basculé au 59 rue de Ponthieu, prolongation au bar ; DJ à minuit du jeudi au dimanche",
];

const frictions = [
  "L'addition : une facture unique pour l'entreprise, annoncée au devis, plutôt que des additions séparées en fin de soirée",
  "Le budget boissons : un forfait par personne évite l'arbitrage délicat entre le responsable et les convives à minuit",
  "Les contraintes alimentaires : collectées avec la liste des participants en amont, jamais découvertes au moment du service",
  "Les non-buveurs et les retours : l'accès aux métros George V et Franklin D. Roosevelt doit être rappelé dans le message d'invitation",
  "Les retardataires : la double entrée après 22h rue de Ponthieu, et deux places gardées par table",
];

export default function TeamBuilding() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Team building au restaurant à Paris : mélanger les équipes, pas seulement les réunir",
      description:
        "Team building aux Champs-Élysées : tables composées, dîner assis ou cocktail, de 10 à 250 collègues, dès 17h, jusqu'à 5h. Devis rapide.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/team-building-restaurant-paris",
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
      url: "https://restaurantchampselysees.fr/team-building-restaurant-paris",
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
        title="Team building restaurant Paris 8e : mélanger les équipes"
        description="Team building aux Champs-Élysées : tables composées, dîner assis ou cocktail, de 10 à 250 collègues, dès 17h, jusqu'à 5h. Devis rapide."
        path="/team-building-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Assiette dressée serveur à table sur banquette pour un dîner de team building aux Champs-Élysées, Paris 8e"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Événement d'équipe</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Team building au restaurant à Paris : mélanger les équipes, pas seulement les réunir
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Un espace dédié dès dix personnes au 76 avenue des Champs-Élysées, une salle qui va du
            dîner assis au club jusqu'à 5h. Ici, le brassage se décide au plan de table.
          </p>
          <a
            href={whatsappLink(TEAMBUILDING_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Organiser notre team building
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Un team building rate rarement par manque d'activité
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Comptez les tables à la fin d'une soirée d'entreprise : elles se sont reconstituées. Le
            service s'est regroupé d'un côté, l'open space de l'autre, les anciens à une extrémité. Ce
            n'est pas un échec de la soirée, c'est la pente naturelle d'un groupe — chacun retourne
            vers ceux dont il partage déjà le quotidien.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Une activité externe déplace cette pente pendant une heure et demie, puis la libère. Un
            repas, lui, impose deux heures à la même place, sans échappatoire polie : c'est une
            contrainte, et c'est précisément ce qui en fait un outil de brassage. Encore faut-il que
            la composition des tables ne reproduise pas l'organigramme.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Tout se joue donc avant la soirée, sur une feuille : qui s'assied à côté de qui.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Cinq règles de composition, à trancher une semaine avant
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Elles tiennent en une page et évitent les tables « services » qui se reforment d'elles-mêmes.
            Les tables se prêtent à des tablées d'une dizaine de convives : assez grandes pour avoir de
            quoi parler, assez petites pour que chacun participe.
          </p>
          <ul className="space-y-3 mb-8">
            {regles.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
          <img
            src={partage}
            alt="Planche à partager et salade servies au centre d'une table pour un repas d'équipe à Paris 8e"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Trois formats, selon l'effectif</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Le format se choisit sur l'effectif avant le budget : le degré de mélange n'a rien à voir
            selon que l'on est assis ou debout.
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
            Le déroulé d'une soirée d'équipe, de 17h à la dernière coupe
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un ordre de grandeur, calé sur les horaires réels : l'accueil des groupes démarre à 17h, par
            créneaux de trente minutes.
          </p>
          <ul className="space-y-3 mb-8">
            {deroule.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les cinq points de friction à régler avant de bloquer la date
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Aucun ne relève de la salle : tous se règlent mieux une semaine avant qu'une heure avant.
          </p>
          <ul className="space-y-3 mb-8">
            {frictions.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Horaires, capacité, accès : ce qui est factuel
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Les groupes sont reçus dès 17h. Du lundi au mercredi, la salle ferme à minuit ; du jeudi
            au dimanche, elle reste ouverte jusqu'à 5h avec un DJ à partir de minuit. La capacité est
            de 500 personnes debout et d'environ 250 convives assis.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            L'adresse principale est le 76 avenue des Champs-Élysées, complétée par le 59 rue de
            Ponthieu, dans le 8e. Les métros George V et Franklin D. Roosevelt sont à quelques
            minutes, des parkings publics à proximité, et l'entrée bascule rue de Ponthieu dès 22h.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour un projet à partir de dix personnes, un interlocuteur unique suit le dossier :{" "}
            <a href={SITE.phoneHref} className="text-primary hover:underline">
              {SITE.phone}
            </a>
            .
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce que le lieu assure, ce que vous apportez
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Côté établissement : la salle, le mobilier, le service, les boissons et l'exécution du plan
            de table tel que vous l'avez transmis. Côté entreprise : la liste des participants avec
            leur service, les contraintes alimentaires, l'enveloppe budgétaire et, si vous souhaitez
            une animation, les besoins techniques — à signaler au devis.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Deux cas voisins méritent une lecture séparée : pour faire travailler les équipes sur un
            sujet, c'est la page{" "}
            <Link to="/seminaire-entreprise-restaurant-paris" className="text-primary hover:underline">
              séminaire d'entreprise
            </Link>{" "}
            à consulter ; pour la fête de fin d'année, la{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise
            </Link>
            . Pour un repas sans logique de mélange, le{" "}
            <Link to="/diner-groupe-restaurant-paris" className="text-primary hover:underline">
              dîner de groupe en grande table
            </Link>{" "}
            et le{" "}
            <Link to="/cocktail-dinatoire-paris" className="text-primary hover:underline">
              cocktail dînatoire
            </Link>{" "}
            détaillent le service, la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation
            </Link>{" "}
            compare les niveaux d'exclusivité, et l'
            <Link to="/galerie" className="text-primary hover:underline">
              aperçu en images
            </Link>{" "}
            donne une idée des volumes.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Team building : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`team-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Votre soirée d'équipe aux Champs-Élysées</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, effectif, format et services représentés : avec ces éléments, vous recevez une
              proposition chiffrée et une composition d'espace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(TEAMBUILDING_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis team building
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
