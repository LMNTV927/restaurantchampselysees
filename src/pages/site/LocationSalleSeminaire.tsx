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
import plat from "@/assets/site/vibe-2.jpg";

const SALLE_MESSAGE =
  "Bonjour Prince Palace, je souhaite louer une salle pour un séminaire. Date souhaitée : ... / Nombre de participants : ... / Créneau horaire : ... / Besoins techniques : ...";

const volumes = [
  {
    title: "1. Un espace dédié, dès 10 participants",
    text: "Pour un comité de direction ou une réunion de service, une zone de la salle est réservée au groupe : tables dressées, chaises en place, et un accès direct au reste du lieu pour les pauses.",
  },
  {
    title: "2. Une partie du restaurant, de 50 à 150 personnes",
    text: "Quand le séminaire réunit plusieurs services, une portion du lieu est fermée pour l'entreprise seule : le groupe dispose de son propre volume sonore, sans croiser la clientèle du restaurant.",
  },
  {
    title: "3. Le lieu entier, jusqu'à 500 personnes",
    text: "Assemblée générale, convention d'ouverture ou soirée de lancement : la totalité de la salle est affectée à l'événement, en configuration cocktail ou assise selon le programme.",
  },
];

const creneaux = [
  "17h — première arrivée possible, à l'ouverture de l'établissement",
  "Réservation par créneaux de 30 minutes, pour caler les arrivées d'équipes",
  "Lundi à mercredi — la salle ferme à minuit, format resserré pour une soirée de semaine",
  "Jeudi à dimanche — la soirée se prolonge jusqu'à 5h, avec DJ à partir de minuit",
  "Dès 22h — entrée par le 59 rue de Ponthieu pour les retardataires et les prestataires",
];

const equipements = [
  {
    title: "Écran et projection",
    text: "Précisez la taille de l'audience et le format de vos supports : l'équipe indique au devis ce qui peut être installé dans le volume retenu.",
  },
  {
    title: "Sonorisation et micros",
    text: "La salle est équipée pour la partie soirée, avec DJ et sonorisation à partir de minuit du jeudi au dimanche. Pour une prise de parole en début de séance, le besoin se signale en amont.",
  },
  {
    title: "Connexion et alimentation",
    text: "Le Wi-Fi et les prises nécessaires aux postes de travail se vérifient avec l'équipe selon la configuration retenue, avant de confirmer la location.",
  },
  {
    title: "Matériel apporté de l'extérieur",
    text: "Un prestataire technique peut être accueilli pour installer un dispositif spécifique, régie, lighting ou matériel de captation, à condition de le prévoir au devis.",
  },
];

const inclus = [
  "Le mobilier dressé selon le format choisi : tables de travail, tables rondes ou mange-debout",
  "La restauration sur place, en menu assis ou cocktail dînatoire, servie dans la salle louée",
  "L'équipe de service et l'accès aux espaces pendant toute la durée retenue",
  "La partie club en fin de soirée, sans transfert vers un second établissement",
  "Deux entrées, 76 avenue des Champs-Élysées et 59 rue de Ponthieu, Paris 8e",
];

const faq = [
  {
    q: "Peut-on louer la salle du Prince Palace pour un séminaire en journée ?",
    a: "Non, l'établissement ouvre à 17h : la location se fait donc en fin de journée et en soirée, jamais le matin ni sur une journée complète. Pour un séminaire classique de 9h à 18h, il faut se tourner vers une salle de réunion ou un centre de congrès.",
  },
  {
    q: "Combien coûte la location d'une salle de séminaire aux Champs-Élysées ?",
    a: "Le tarif dépend de la date, du volume de salle retenu, du nombre de participants et de la formule de restauration. Chaque demande reçoit une proposition chiffrée après échange sur le programme, sans engagement.",
  },
  {
    q: "La location de la salle inclut-elle la restauration ?",
    a: "Oui, il ne s'agit pas d'une salle vide louée à l'heure : la location s'accompagne d'une restauration servie sur place, en menu assis ou en cocktail dînatoire. Le format se choisit au moment du devis, en fonction de l'effectif.",
  },
  {
    q: "Quel matériel technique faut-il prévoir pour un séminaire ?",
    a: "Écran, sonorisation, micros et connexion se valident lors de la demande de devis, qui précise ce qui est disponible dans la salle retenue. Un prestataire extérieur peut compléter l'installation si votre dispositif le demande.",
  },
  {
    q: "Peut-on visiter la salle avant de confirmer la location ?",
    a: "La visite se cale avec l'équipe en amont de la date, en fin de journée avant le service. C'est l'occasion de vérifier le plan de salle, l'emplacement de la prise de parole et le parcours des invités entre les deux entrées.",
  },
  {
    q: "Comment se rendre à la salle en transports en commun ?",
    a: "Le lieu se situe au 76 avenue des Champs-Élysées, à quelques minutes des métros George V et Franklin D. Roosevelt. Plusieurs parkings publics se trouvent à proximité pour les participants qui viennent en voiture.",
  },
];

export default function LocationSalleSeminaire() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Location de salle de séminaire aux Champs-Élysées",
      description:
        "Location de salle de séminaire à Paris 8e : espace dès 10 personnes jusqu'à 500, restauration sur place, créneaux dès 17h et soirée jusqu'à 5h aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/location-salle-seminaire-paris",
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
        title="Location de salle de séminaire aux Champs-Élysées"
        description="Location de salle de séminaire à Paris 8e : espace dès 10 personnes jusqu'à 500, restauration sur place, créneaux dès 17h, soirée jusqu'à 5h."
        path="/location-salle-seminaire-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Table dressée dans la salle de séminaire du Prince Palace, aux Champs-Élysées"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Location d'espace
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Location de salle de séminaire aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Une salle au 76 avenue des Champs-Élysées, de 10 à 500 personnes, avec la
            restauration et la soirée sur place : la location se prend en fin de journée.
          </p>
          <a
            href={whatsappLink(SALLE_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander les disponibilités
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Louer une salle ici, ce n'est pas louer une salle vide
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Chercher une salle de séminaire sur les Champs-Élysées conduit le plus souvent à des
            espaces de coworking facturés à l'heure, des salles de réunion d'hôtel sans
            restauration, ou des lofts où tout reste à organiser : traiteur, mobilier, sonorisation.
            Le Prince Palace se situe à l'inverse de ce modèle. La location porte sur une salle
            équipée et dressée, dans un établissement en activité, avec une équipe de service et une
            cuisine déjà en place.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            La conséquence est simple : vous réservez un volume, un créneau et une formule de
            restauration, et rien d'autre à coordonner. Le lieu n'est pas une coquille vide
            disponible à la journée : c'est un restaurant qui réserve une partie de sa salle à votre
            entreprise, avec ses contraintes horaires assumées et annoncées dès la première réponse.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois volumes de salle selon l'effectif
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Le volume se choisit d'après le nombre de participants, pas d'après la surface
            disponible : une salle trop grande disperse une réunion de dix personnes, une salle trop
            petite étouffe une assemblée de deux cents.
          </p>
          <div className="space-y-8">
            {volumes.map((v) => (
              <div key={v.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les créneaux réellement disponibles
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            C'est le point à vérifier avant toute autre chose : l'établissement ouvre à 17h. Un
            séminaire s'y tient donc en fin de journée, avec une session de travail qui glisse vers
            le dîner puis la soirée. Une équipe qui cherche une salle de 9h à 18h ne trouvera pas
            ici ce qu'elle attend, et il vaut mieux le savoir avant de fixer la date.
          </p>
          <ul className="space-y-3 mb-8">
            {creneaux.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Ce cadrage horaire devient un avantage dès que le séminaire se pense comme un moment
            collectif : les équipes arrivent après leur journée, travaillent deux heures, dînent
            ensemble et prolongent sans disperser le groupe aux quatre coins de Paris en fin de
            soirée.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            L'équipement se cadre au devis, pas après
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Une salle de séminaire se juge autant sur sa surface que sur ce qu'elle permet de faire.
            Le détail des besoins se traite au moment de la demande, de façon nominative, plutôt
            qu'en supposant un matériel standard.
          </p>
          <div className="space-y-8">
            {equipements.map((e) => (
              <div key={e.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{e.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{e.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce que comprend la location
          </h2>
          <ul className="space-y-3 mb-8">
            {inclus.map((i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {i}
              </li>
            ))}
          </ul>
          <img
            src={plat}
            alt="Assiette de saumon servie à table dans la salle du Prince Palace, Paris 8e"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Préparer la demande de location
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Quatre informations suffisent pour obtenir une réponse exploitable : la date envisagée,
            le nombre de participants, l'heure d'arrivée souhaitée et le format de la fin de
            soirée. L'équipe revient avec un plan de salle, une formule de restauration et un
            chiffrage avant toute confirmation.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour comparer les formats, la page{" "}
            <Link to="/seminaire-entreprise-restaurant-paris" className="text-primary hover:underline">
              séminaire d'entreprise
            </Link>{" "}
            détaille le déroulé d'une session de travail et{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation de restaurant
            </Link>{" "}
            expose les trois niveaux d'exclusivité. Si la soirée se prolonge, la page{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise
            </Link>{" "}
            explique la bascule vers le club, et la{" "}
            <Link to="/restaurant" className="text-primary hover:underline">
              présentation du restaurant
            </Link>{" "}
            donne le cadre général du lieu.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Location de salle : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`salle-faq-${i}`} className="border-primary/15">
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
              Vérifions la disponibilité de la salle
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, effectif, créneau et besoins techniques : demandez un devis ou réservez
              directement une table pour un groupe plus réduit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(SALLE_MESSAGE)}
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
