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
import assiettes from "@/assets/site/privatisation.jpg";

const ARBRE_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser l'arbre de Noël de mon entreprise. Date envisagée : ... / Nombre d'enfants : ... / Nombre d'adultes : ... / Distribution de cadeaux prévue : oui ou non";

const horaires = [
  "Ouverture des groupes à 17h — l'heure de sortie d'école tombe juste avant",
  "Arrivées réparties par tranches de 30 minutes, jusqu'à 5h du matin",
  "Du lundi au mercredi, la maison ferme à minuit : le goûter-dîner tient dans la soirée",
  "Du jeudi au dimanche, la salle reste ouverte jusqu'à 5h et le DJ prend le relais à minuit",
];

const logistique = [
  {
    title: "1. Livrer les cadeaux avant la soirée, jamais avec les invités",
    text: "Les cartons arrivent en journée et sont stockés hors de la salle. Un enfant qui aperçoit la pile de paquets avant l'heure comprend qu'il y a un stock, cherche son nom dedans, et la surprise tombe. Le dépôt se cale la veille ou le matin même, jamais à 16h55.",
  },
  {
    title: "2. Étiqueter par prénom, puis ranger par table",
    text: "Le classement alphabétique est une fausse bonne idée : personne ne se souvient de l'initiale du petit dernier arrivé en septembre. Un prénom lisible sur chaque paquet, regroupé par table, permet de distribuer sans qu'un enfant reste sans cadeau — l'oubli est la seule erreur que les parents remarquent.",
  },
  {
    title: "3. Désigner une seule personne qui appelle les prénoms",
    text: "Deux adultes qui appellent en même temps créent un brouhaha où les enfants se lèvent sans savoir où aller. Un référent tient la liste, un second tend les paquets, et le Père Noël n'a plus qu'à saluer : le circuit tourne sans temps mort.",
  },
];

const enfants = [
  "Un espace au calme pour les moins de trois ans, à l'écart de la sonorisation",
  "Une circulation dégagée pour les poussettes entre l'entrée et les tables",
  "Les allergies signalées avant la soirée, pas au moment du service",
  "Un plat qui se partage au centre de la table — les enfants mangent en pic, pas en continu",
  "Le sucré après les cadeaux plutôt qu'avant, pour éviter la surexcitation en pleine distribution",
];

const faq = [
  {
    q: "Peut-on organiser un arbre de Noël en fin d'après-midi plutôt qu'à 14h ?",
    a: "Oui, et c'est même le créneau naturel ici : la maison accueille les groupes à partir de 17h, soit juste après la sortie des classes. Les familles arrivent directement de l'école, l'arbre de Noël occupe la fin d'après-midi et la soirée se prolonge par le dîner sur place.",
  },
  {
    q: "Combien d'enfants et d'adultes la salle peut-elle recevoir ?",
    a: "Le lieu reçoit un espace dédié dès dix personnes, une privatisation partielle de 50 à 150 convives, et l'ensemble de la salle jusqu'à 500 personnes en cocktail, avec environ 250 couverts en repas assis. Pour un arbre de Noël, on compte en général un adulte pour un ou deux enfants.",
  },
  {
    q: "Faut-il apporter les cadeaux soi-même et où sont-ils stockés ?",
    a: "Les cadeaux sont fournis par l'entreprise. Le plus simple est de les faire livrer en journée, avant l'arrivée des invités : l'équipe les entrepose hors de la salle jusqu'au moment de la distribution, ce qui préserve l'effet de surprise pour les enfants.",
  },
  {
    q: "Qui joue le Père Noël et faut-il un animateur ?",
    a: "L'animation reste à l'initiative de l'entreprise : un salarié volontaire ou un prestataire extérieur, au choix. L'essentiel est de désigner un référent unique qui appelle les prénoms, et de prévoir un point de passage visible depuis les tables pour que la distribution ne bloque pas la circulation.",
  },
  {
    q: "Comment se passe le repas avec des enfants et des adultes à la même table ?",
    a: "Un menu de groupe est défini en amont avec l'organisateur, avec des options végétariennes. Pour un arbre de Noël, on cale un service plus tôt pour les plus jeunes et un rythme plus lent pour les adultes, avec des plats à partager au centre de la table.",
  },
  {
    q: "Faut-il privatiser le restaurant pour un arbre de Noël d'entreprise ?",
    a: "Pas nécessairement. Un groupe à partir de dix personnes dispose d'un espace dédié ; la privatisation partielle devient utile entre 50 et 150 convives, quand la distribution des cadeaux a besoin d'un volume au calme. Au-delà, la salle entière se réserve.",
  },
];

export default function ArbreDeNoelEntreprise() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Arbre de Noël d'entreprise à Paris, aux Champs-Élysées",
      description:
        "Arbre de Noël d'entreprise aux Champs-Élysées : enfants et parents réunis dès 17h, distribution des cadeaux et dîner de fête. Devis groupe.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/arbre-de-noel-entreprise-paris",
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
        title="Arbre de Noël d'entreprise à Paris 8e | Prince Palace"
        description="Arbre de Noël d'entreprise aux Champs-Élysées : enfants et parents réunis dès 17h, distribution des cadeaux et dîner de fête. Devis groupe."
        path="/arbre-de-noel-entreprise-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Planche à partager servie à table au Prince Palace, pour un arbre de Noël d'entreprise à Paris"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Fête de fin d'année
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Arbre de Noël d'entreprise à Paris, aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Réunir les enfants des salariés et leurs parents dès 17h, distribuer les cadeaux au bon
            moment, puis passer à table — de dix personnes à la salle entière.
          </p>
          <a
            href={whatsappLink(ARBRE_MESSAGE)}
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
            L'arbre de Noël n'est pas le dîner de fin d'année
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Les deux rendez-vous se ressemblent par le mois et par le mot « Noël », rarement par le
            contenu. Un dîner de fin d'année parle aux adultes : bilan, remerciements, remises de
            médailles, et une soirée qui s'étire. Un arbre de Noël parle d'abord aux enfants. Le
            programme tient en trois temps — arriver, voir le Père Noël, repartir avec un paquet —
            et tout le reste doit s'organiser autour de cette attente.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Cette différence change la logique de la soirée. Quand l'invité d'honneur a six ans, ce
            n'est pas le menu qui commande, c'est le temps qu'on peut lui demander d'attendre.
            L'organisateur arbitre donc moins sur le budget que sur le minutage : quand les familles
            arrivent, quand le Père Noël entre en scène, et jusqu'où les enfants tiennent.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            17h : l'horaire qui tombe juste après l'école
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            On imagine souvent un arbre de Noël à 14h, pendant une demi-journée de congé. La maison
            ouvre ses portes aux groupes à 17h, et ce créneau se révèle plus simple à tenir
            qu'un après-midi : les enfants sortent de classe, les parents n'ont pas à prendre une
            journée, et la fête débouche naturellement sur le dîner. Personne n'a besoin de
            repartir entre deux.
          </p>
          <ul className="space-y-3 mb-8">
            {horaires.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            L'heure de fin se décide avec le jour de la semaine. Un mardi, la salle ferme à minuit :
            la fête s'achève sur le dîner, avec des enfants encore réveillés mais pas épuisés. Un
            vendredi laisse la place à ceux qui restent — les familles partent vers 20h, les
            collègues enchaînent dans la même salle.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les cadeaux : le seul poste qui ne se rattrape pas
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Le menu s'ajuste jusqu'au soir, la décoration se répartit en une heure. Un paquet
            manquant, lui, ne se répare pas devant l'enfant qui attend. Trois précautions suffisent,
            et toutes se prennent en amont.
          </p>
          <div className="space-y-8 mb-8">
            {logistique.map((etape) => (
              <div key={etape.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{etape.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{etape.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Le passage du Père Noël se chronomètre
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Vingt-cinq secondes par enfant paraissent courtes, jusqu'au moment où l'on multiplie par
            quarante-cinq. Sans compter la photo, le câlin, et le petit qui refuse d'avancer.
            Comptez quinze à vingt minutes de distribution pour une cinquantaine d'enfants, et
            prévoyez ce temps dans le déroulé plutôt que de l'improviser entre deux plats.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Trois détails font la différence le soir venu. Le point de passage : ni à l'entrée, où
            l'on bloque les arrivées, ni au milieu de l'allée, mais à un endroit visible de toutes
            les tables. La voix : dans une salle pleine, un prénom lancé sans micro se perd dès la
            deuxième rangée. L'ordre enfin — les plus jeunes d'abord, pendant qu'ils sont encore
            disponibles, ou table par table pour éviter la cohue.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Reste le rôle : qui enfile le costume. Un salarié volontaire ou un prestataire, briefé
            dans les deux cas sur la liste et sur l'ordre de passage — c'est ce qui distingue un
            Père Noël qui avance d'un Père Noël qui cherche ses paquets.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Deux rythmes à table : les enfants d'abord
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Enfants et adultes ne mangent pas à la même vitesse : servis ensemble, les plus jeunes
            ont terminé avant que les entrées des parents n'arrivent. Le repas se cale donc sur deux
            temps, avec des plats posés au centre de la table, que chacun sert à son rythme.
          </p>
          <ul className="space-y-3 mb-8">
            {enfants.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <img
            src={assiettes}
            alt="Assiettes dressées et servies à table lors d'une fête d'entreprise au Prince Palace"
            width={1600}
            height={1200}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce que l'équipe demande pour chiffrer un arbre de Noël
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Trois informations reviennent systématiquement : la date ou la semaine visée, le nombre
            d'enfants séparé du nombre d'adultes, et la durée du créneau souhaité. La répartition
            entre les âges détermine le plan de salle, l'heure du service et le moment de la
            distribution.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            S'y ajoutent deux choix qui pèsent sur la proposition : la présence d'un dîner complet
            ou d'un format plus léger autour du goûter, et le niveau d'intimité recherché — un
            espace dédié dès dix personnes, une partie de salle pour 50 à 150 convives, ou
            l'ensemble du lieu jusqu'à 500 en cocktail. Le devis se construit sur ces éléments,
            jamais sur un tarif affiché.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour situer ce rendez-vous parmi les formats de décembre, le{" "}
            <Link to="/diner-fin-annee-entreprise-paris" className="text-primary hover:underline">
              dîner de fin d'année d'entreprise
            </Link>{" "}
            décrit la version adulte, le{" "}
            <Link to="/reveillon-entreprise-paris" className="text-primary hover:underline">
              réveillon du 31 décembre
            </Link>{" "}
            la soirée la plus demandée de l'année, et la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du restaurant
            </Link>{" "}
            les niveaux d'exclusivité. Pour un anniversaire d'enfant, voir la page{" "}
            <Link to="/anniversaire-restaurant-paris" className="text-primary hover:underline">
              anniversaire au restaurant
            </Link>
            . Le cadre du lieu et les formules groupe sont détaillés sur les pages{" "}
            <Link to="/restaurant" className="text-primary hover:underline">
              restaurant
            </Link>{" "}
            et{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">
              événementiel aux Champs-Élysées
            </Link>
            . Renseignements au {SITE.phone}.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">
            Arbre de Noël d'entreprise : vos questions
          </h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`arbre-faq-${i}`} className="border-primary/15">
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
              Réservez la date de votre arbre de Noël
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, nombre d'enfants et d'adultes, distribution de cadeaux : demandez un devis ou
              réservez directement pour un groupe plus réduit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(ARBRE_MESSAGE)}
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
