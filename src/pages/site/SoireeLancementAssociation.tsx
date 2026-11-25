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
import hero from "@/assets/site/hero-lounge.jpg";
import partage from "@/assets/site/restaurant-table.jpg";

const ASSO_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser la soirée de lancement d'une association. Date envisagée : ... / Nombre d'invités : ... / Format (cocktail, dîner ou les deux) : ... / Heure souhaitée pour les prises de parole : ...";

const publics = [
  {
    title: "Les fondateurs et les bénévoles",
    text: "Ils se connaissent, ils ont monté la soirée et ils ont envie de se retrouver. Leur réflexe est de rester groupés : au centre de la salle, ils forment un noyau qui décourage les nouveaux venus. Les répartir en périphérie, un ou deux par tablée, fait de la salle un réseau plutôt qu'un îlot.",
  },
  {
    title: "Ceux qui découvrent l'association",
    text: "Ils arrivent seuls ou en couple, sans connaître personne d'autre que la main qui les a invités, et repartent au bout d'une heure s'ils n'ont parlé à quiconque. Ce sont eux qui adhèrent : il leur faut un point de contact identifiable très vite, pas un discours.",
  },
  {
    title: "Les partenaires et les institutionnels",
    text: "Ils viennent avec une attente de représentation : un mot en public, une photo, une poignée de main. Deux minutes dédiées, tôt dans la soirée, les satisfont et évitent qu'ils partent avant la prise de parole qui crédibilise l'appel à adhérer.",
  },
];

const stand = [
  "Deux personnes au stand : une qui répond aux questions, une qui remplit et encaisse",
  "Un moyen de paiement sur place : carte, QR code d'adhésion en ligne, et de la monnaie",
  "Un formulaire en double exemplaire, dont un reste à l'adhérent comme justificatif",
  "Une signalétique lisible à trente mètres, sans avoir à demander où l'on s'inscrit",
];

const paroles = [
  {
    title: "1. Le récit fondateur, cinq minutes",
    text: "Pourquoi l'association existe, raconté par une seule voix et à partir d'une situation concrète plutôt que d'un constat général. C'est la seule séquence où la salle accepte d'écouter : au-delà de sept minutes, l'attention se décroche et les téléphones sortent.",
  },
  {
    title: "2. Le programme de l'année, huit minutes",
    text: "Ce que l'association va faire, quand, et avec quels moyens. Trois dates et deux actions valent mieux qu'une liste de projets : c'est cette séquence qui transforme la sympathie en confiance, en montrant à quoi servira la cotisation.",
  },
  {
    title: "3. L'appel à adhérer, trois minutes",
    text: "Le montant, ce qu'il finance, et l'endroit où l'on s'inscrit — désigné à la main dans la salle. La formulation compte : « allez voir le stand » produit nettement moins que « je vous attends au stand, à droite du bar ».",
  },
];

const formats = [
  {
    title: "1. Cocktail debout, jusqu'à 500 invités",
    text: "Le format le moins coûteux par personne, et celui qui convient le mieux à un lancement : les invités circulent, le stand travaille, nul ne subit un repas de trois heures. En contrepartie, la salle n'est jamais réunie pour écouter : prises de parole courtes, sonorisées et tôt.",
  },
  {
    title: "2. Dîner assis, environ 250 couverts",
    text: "À réserver aux lancements qui réunissent surtout des membres déjà engagés ou des partenaires à remercier. Le repas crée une attention captive, mais il double le budget par personne et fixe une heure d'arrivée stricte.",
  },
  {
    title: "3. Cocktail puis dîner, la formule mixte",
    text: "Celle qui laisse le plus de chances à l'adhésion : les invités arrivent entre 18h et 19h, le cocktail et le stand font leur travail, et seuls les plus engagés passent à table. L'heure de passage doit figurer sur l'invitation.",
  },
];

const creneaux = [
  "17h — ouverture, accueil debout, stand d'adhésion déjà installé",
  "18h30 — mot d'accueil de deux minutes, sans discours",
  "19h — récit fondateur, puis présentation du programme de l'année",
  "19h30 — appel à adhérer et ouverture du buffet",
  "21h — dernier passage au stand, remerciements, fin libre",
];

const faq = [
  {
    q: "Peut-on privatiser seulement une partie de la salle pour un lancement d'association ?",
    a: "Oui : la privatisation partielle couvre 50 à 150 convives, et un espace dédié est possible dès dix personnes. Au-delà de 150 invités, c'est l'ensemble du lieu qui se privatise, jusqu'à 500 personnes en formule debout et environ 250 couverts en repas assis.",
  },
  {
    q: "Faut-il prévoir une sonorisation pour un cocktail debout ?",
    a: "Oui. Sans micro, une prise de parole est inaudible au-delà de trois rangées de personnes debout. Le dispositif se cale au devis avec le nombre de micros et la durée d'une éventuelle projection : mieux vaut l'indiquer dès la demande que la semaine de l'événement.",
  },
  {
    q: "À quelle heure convient-on les invités d'un lancement associatif ?",
    a: "À 17h ou 18h. Les groupes sont reçus dès 17h, ce qui laisse deux heures de cocktail avant les prises de parole. Un créneau plus tardif oblige à tout concentrer et laisse les invités repartir avant le moment où l'on sollicite les adhésions.",
  },
  {
    q: "Peut-on encaisser les adhésions directement sur place ?",
    a: "Oui, à condition de prévoir un moyen de paiement et un justificatif. La carte et le QR code d'adhésion en ligne couvrent la plupart des cas ; l'espèce reste utile pour les adhésions de soutien de petit montant, et demande alors de la monnaie préparée à l'avance.",
  },
  {
    q: "Combien de temps faut-il pour installer un stand et un fond de scène ?",
    a: "Comptez une heure à deux personnes pour un fond de scène, une banderole et un stand. Ce temps se prévoit au devis, car l'accès en amont d'une soirée ne se déroule pas comme une simple réservation de table.",
  },
  {
    q: "Peut-on projeter une vidéo pendant la soirée ?",
    a: "Oui, en la calant au devis avec la sonorisation. Une vidéo de trois minutes passe bien avant le récit fondateur ; au-delà, l'attention d'une salle debout se disperse et le stand se retrouve seul au moment où il devrait être le plus fréquenté.",
  },
];

export default function SoireeLancementAssociation() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Soirée de lancement d'association à Paris, aux Champs-Élysées",
      description:
        "Lancer une association : le stand d'adhésion, l'ordre des prises de parole, le format selon le budget. Cocktail debout ou dîner assis, dès 17h à Paris 8e.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/soiree-lancement-association-paris",
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
        title="Soirée de lancement d'association à Paris 8e | Prince Palace"
        description="Lancer une association : stand d'adhésion, ordre des prises de parole, format selon le budget. Cocktail debout ou dîner assis, dès 17h aux Champs-Élysées."
        path="/soiree-lancement-association-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Cocktail servi à l'apéritif d'une soirée de lancement d'association au Prince Palace, Champs-Élysées"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Vie associative
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Soirée de lancement d'association à Paris, aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Une association qui se lance n'a pas besoin d'une fête : elle a besoin que des gens,
            à la fin de la soirée, aient signé. Le programme se construit autour de ce seul
            chiffre.
          </p>
          <a
            href={whatsappLink(ASSO_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander un devis
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Une soirée de lancement ne se mesure pas au nombre de présents
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            On compte les têtes le soir même, puis on déchante en relisant les formulaires. Un
            lancement associatif se juge aux adhésions récoltées, pas aux verres levés : une salle
            pleine qui repart sans signature laisse l'association où elle était la veille.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La mécanique ressemble à celle d'un gala, à une différence près : le budget. Une
            structure naissante arbitre entre la salle, le buffet et la communication avec une
            marge étroite, et chaque euro mis dans le décor est retiré au fonds de démarrage.
            D'où le format debout et le programme court.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Reste un point que l'on découvre en préparant : les invités ne viennent pas pour la
            même raison. Les uns soutiennent un proche, d'autres jaugent l'association avant de
            s'engager, d'autres représentent un partenaire. Leur adresser le même discours est la
            première cause d'une soirée réussie qui ne convertit personne.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois publics que rien ne fait se mélanger
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Dans une salle, les groupes se reconstituent d'eux-mêmes : les habitués près du bar,
            les curieux à l'entrée. La disposition peut corriger cela, si elle est décidée avant
            l'installation.
          </p>
          <div className="space-y-8">
            {publics.map((p) => (
              <div key={p.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Le stand d'adhésion décide de la soirée
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Trois erreurs suffisent à annuler un bon programme : un stand près de la sortie, tenu
            par une seule personne, sans moyen de paiement. L'emplacement utile se trouve sur le
            trajet entre l'entrée et le buffet : les invités y passent deux fois, et la seconde
            fois ils savent de quoi il s'agit.
          </p>
          <ul className="space-y-3 mb-8">
            {stand.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <img
            src={partage}
            alt="Planche à partager servie pendant un cocktail de lancement d'association au Prince Palace, Paris 8e"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois prises de parole, pas une de plus
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Six intervenants et la moitié de la salle a disparu avant l'appel à adhérer. Trois
            séquences suffisent, seize minutes en tout.
          </p>
          <div className="space-y-8">
            {paroles.map((p) => (
              <div key={p.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Quel format pour un budget associatif
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Le nombre d'invités ne tranche pas : c'est la part du budget mise dans l'assiette qui
            décide du format.
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
            Un minutage qui laisse le temps d'adhérer
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Les prises de parole arrivent tôt, quand la salle est encore pleine.
          </p>
          <ul className="space-y-3 mb-8">
            {creneaux.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Décalé d'une heure, le même programme tombe après le départ des premiers venus. Du
            lundi au mercredi, la maison ferme à minuit, ce qui suffit à un lancement commencé à
            17h ; du jeudi au dimanche, la soirée va jusqu'à 5h, avec la piste à partir de minuit.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les quatre informations qui font gagner un aller-retour
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La date visée, le nombre d'invités, le format — debout, assis, ou cocktail puis dîner —
            et l'heure des prises de parole : ces quatre éléments cadrent un devis. Le nombre fixe
            ensuite le volume : un espace dédié dès dix personnes, une partie de salle de 50 à 150
            convives, tout le lieu jusqu'à 500 debout et environ 250 couverts assis.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour comparer, voyez la{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise
            </Link>{" "}
            quand le public est interne, le{" "}
            <Link to="/cocktail-dinatoire-paris" className="text-primary hover:underline">
              cocktail dînatoire
            </Link>{" "}
            pour un lancement debout, le{" "}
            <Link to="/diner-groupe-restaurant-paris" className="text-primary hover:underline">
              dîner de groupe
            </Link>{" "}
            pour une grande tablée et la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du restaurant
            </Link>{" "}
            pour les niveaux d'exclusivité. Le{" "}
            <Link to="/gala-caritatif-entreprise-paris" className="text-primary hover:underline">
              gala caritatif
            </Link>{" "}
            et les{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">
              formules événementielles
            </Link>{" "}
            sont détaillés ailleurs. Renseignements au {SITE.phone}, 76 avenue des
            Champs-Élysées et 59 rue de Ponthieu, Paris 8e — entrée par le 59 rue de Ponthieu
            après 22h, métros George V et Franklin D. Roosevelt.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Lancer son association : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`asso-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Fixez la date du lancement</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, nombre d'invités, format et heure des prises de parole : demandez un devis, ou
              réservez directement pour un comité plus réduit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(ASSO_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis groupe
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
