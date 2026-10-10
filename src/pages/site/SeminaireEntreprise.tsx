import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/hero-lounge.jpg";
import table from "@/assets/site/restaurant-table.jpg";

const SEMINAIRE_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un séminaire d'entreprise. Date souhaitée : ... / Nombre de participants : ... / Format (session de travail, dîner, soirée) : ... / Besoins techniques : ...";

const faq = [
  {
    q: "Combien de personnes peut accueillir un séminaire au Prince Palace ?",
    a: "Le lieu dispose d'une capacité de 500 places, avec environ 250 convives assis. Un espace dédié convient dès 10 personnes, la privatisation partielle accueille de 50 à 150 participants et la privatisation totale ouvre l'ensemble du restaurant.",
  },
  {
    q: "À quelle heure peut démarrer une session de travail ?",
    a: "L'accueil des groupes commence à 17h, à l'ouverture de l'établissement. Un séminaire au Prince Palace se déroule donc en fin de journée et en soirée : session de travail, puis dîner et ambiance club. Du lundi au mercredi, la salle ferme à minuit ; du jeudi au dimanche, la soirée se prolonge jusqu'à 5h.",
  },
  {
    q: "Peut-on dîner sur place après le séminaire ?",
    a: "Oui. Le dîner est servi dans la continuité de la session de travail, en menu assis ou en cocktail dînatoire selon le format retenu. À partir de minuit, la salle passe en ambiance club avec DJ, ce qui évite tout déplacement de vos équipes.",
  },
  {
    q: "Quels équipements techniques sont disponibles pour une réunion ?",
    a: "Les besoins techniques (écran, sonorisation, micros, connexion) sont validés avec l'équipe au moment de la demande de devis, afin de vous indiquer précisément ce qui est disponible sur place. Un prestataire externe peut également être accueilli pour installer un matériel spécifique.",
  },
  {
    q: "Comment réserver pour un groupe de moins de 10 personnes ?",
    a: "Un groupe réduit peut être accueilli dans un espace dédié et réservé directement en ligne, par créneaux de 30 minutes à partir de 17h. Au-delà de 10 participants, il suffit de demander un devis pour construire le déroulé du séminaire.",
  },
  {
    q: "Comment se rendre au Prince Palace pour un séminaire ?",
    a: "Le restaurant se situe au 76 avenue des Champs-Élysées, avec une entrée à l'angle au 59 rue de Ponthieu, Paris 8. Les métros George V et Franklin D. Roosevelt sont à quelques minutes, et plusieurs parkings publics se trouvent à proximité immédiate.",
  },
];

const espaces = [
  {
    title: "1. Espace dédié, dès 10 participants",
    text: "Pour un comité de direction, une réunion de service ou un atelier, une partie de la salle est réservée à votre groupe. Vos collaborateurs restent entre eux, sans privatiser la totalité du lieu.",
  },
  {
    title: "2. Privatisation partielle, de 50 à 150 invités",
    text: "La formule intermédiaire pour un séminaire de plusieurs services : un espace de travail identifié, la restauration à proximité immédiate et la possibilité de poursuivre la soirée sur place.",
  },
  {
    title: "3. Privatisation totale, toute l'équipe réunie",
    text: "Jusqu'à 500 personnes en configuration cocktail et environ 250 convives assis : l'ensemble du lieu est consacré à votre entreprise, du discours de direction au dîner puis au club.",
  },
];

const deroule = [
  "17h — accueil des participants et café de bienvenue dans l'espace réservé",
  "17h30 à 19h30 — session plénière, ateliers ou présentations dans la salle",
  "19h30 — dîner assis ou cocktail dînatoire, prolongé par les échanges libres",
  "22h — accès par le 59 rue de Ponthieu, facilité pour vos invités et prestataires",
  "Minuit — ambiance club avec DJ, jusqu'à 5h du jeudi au dimanche",
];

export default function SeminaireEntreprise() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Séminaire d'entreprise à Paris : un restaurant aux Champs-Élysées",
      description:
        "Séminaire d'entreprise à Paris 8e : espace privatisable aux Champs-Élysées pour vos sessions de travail, puis dîner et club jusqu'à 5h. Devis sur mesure.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/seminaire-entreprise-restaurant-paris",
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
        title="Séminaire d'entreprise à Paris : restaurant Champs-Élysées"
        description="Séminaire d'entreprise à Paris 8e : espace privatisable aux Champs-Élysées, réunion puis dîner et club jusqu'à 5h. Capacité 500. Devis sur mesure."
        path="/seminaire-entreprise-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection image={hero} alt="Salle du Prince Palace privatisée pour un séminaire d'entreprise à Paris" priority>
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Entreprises</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Séminaire d'entreprise au restaurant à Paris 8e
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Une salle privatisable sur les Champs-Élysées pour votre session de travail, puis le
            dîner et la soirée sur place, de 10 à 500 participants.
          </p>
          <a
            href={whatsappLink(SEMINAIRE_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander un devis séminaire
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Un séminaire dans un restaurant plutôt qu'en salle de réunion</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Trouver un lieu de séminaire à Paris revient souvent à comparer des salles de réunion
            d'hôtel, des centres de congrès ou des espaces de coworking loués à l'heure. Ces salles
            fonctionnent, mais elles imposent leur décor, une restauration séparée et parfois un
            changement de lieu entre la réunion et le repas.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le Prince Palace propose l'inverse : un seul lieu, une seule équipe, deux adresses
            (76 avenue des Champs-Élysées et 59 rue de Ponthieu) et une salle que l'on aménage selon
            votre programme. La session de travail, le dîner et la soirée s'enchaînent sans que vos
            collaborateurs aient à reprendre le métro.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Les métros George V et Franklin D. Roosevelt sont à quelques minutes, comme plusieurs
            parkings publics : un séminaire accessible pour des équipes qui viennent de toute
            l'Île-de-France, et une adresse qui marque pour vos invités extérieurs.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Capacité et espaces selon la taille du séminaire</h2>
          <div className="space-y-8">
            {espaces.map((e) => (
              <div key={e.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{e.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{e.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Quels séminaires organiser au Prince Palace ?</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La salle s'adapte à des objectifs très différents, du moment convivial à la réunion
            structurée. Les demandes les plus fréquentes concernent :
          </p>
          <ul className="space-y-3 mb-6">
            {[
              "Le séminaire de rentrée ou d'ouverture d'année : présentation de la stratégie, annonce des objectifs, puis dîner pour souder les équipes",
              "Le bilan annuel ou trimestriel : rétrospective par service, remise de récompenses et soirée avec DJ",
              "Le lancement de projet ou de produit interne : présentation aux équipes, ateliers par groupes puis cocktail dînatoire",
              "La formation ou l'atelier de cohésion : travail en petits groupes dans un espace réservé, suivi d'un repas partagé",
              "La réunion élargie avec partenaires ou clients : accueil dans une adresse emblématique des Champs-Élysées, puis dîner",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Le rythme se cale sur votre programme : accueil des participants, temps de travail,
            pause, prise de parole, puis dîner. Un séminaire qui se termine par un repas et une
            soirée sur place évite la dispersion des équipes en fin de journée, lorsque chacun
            cherche un moyen de rentrer.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Le déroulé d'un séminaire en soirée</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            L'accueil des groupes commence à 17h, à l'ouverture de l'établissement. Un séminaire au
            Prince Palace se déroule donc en fin de journée : la session de travail laisse
            naturellement place au dîner, puis à la soirée.
          </p>
          <ul className="space-y-3 mb-8">
            {deroule.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <img
            src={table}
            alt="Table dressée au Prince Palace avant le dîner d'un séminaire à Paris 8e"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Préparer la partie technique et logistique</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un séminaire réussi tient à des détails préparés à l'avance : le placement de la salle,
            le rythme des pauses, le moment du dîner et le matériel dont vous avez besoin. Au moment
            de la demande de devis, précisez le nombre de participants, la durée de votre session de
            travail et vos besoins techniques (écran, sonorisation, micros, connexion).
            L'équipe vous indique alors ce qui est disponible sur place et ce qui peut être apporté
            par un prestataire que nous accueillons.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Après 22h, l'accès se fait par le 59 rue de Ponthieu, ce qui simplifie l'installation du
            matériel et l'arrivée des intervenants. Les équipes qui prolongent la soirée trouveront
            sur place la partie club, sans transfert vers un second établissement.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour cadrer le format, vous pouvez consulter nos pages{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">soirée d'entreprise</Link>,{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">privatisation du restaurant</Link> et{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">événementiel</Link>.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Demander un devis pour votre séminaire</h2>
          <p className="text-muted-foreground leading-relaxed">
            Indiquez par WhatsApp la date envisagée, le nombre de participants, le format souhaité
            (session de travail, dîner, soirée complète) et vos contraintes techniques. Vous recevez
            une proposition détaillée — plan de salle, restauration, déroulé — avant toute
            confirmation. Pour un groupe de moins de 10 personnes, la réservation en ligne sur
            notre site suffit.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Séminaire d'entreprise : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`seminaire-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Organisez votre séminaire aux Champs-Élysées</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Recevez une proposition adaptée à votre programme et au nombre de participants.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(SEMINAIRE_MESSAGE)}
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
