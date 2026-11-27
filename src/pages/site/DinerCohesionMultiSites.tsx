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
import assiette from "@/assets/site/detail-table.jpg";

const COHESION_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un dîner de cohésion pour un groupe multi-sites. Date envisagée : ... / Nombre de convives par site : ... / Format (dîner assis ou cocktail) : ... / Heure de départ des équipes venant de province : ...";

const regles = [
  {
    title: "1. Deux ou trois collègues par table de dix, jamais plus",
    text: "Au-delà de trois, le groupe se reforme de lui-même et la table redevient une annexe du site. Une pastille de couleur par origine sur le plan, recomptée avant l'envoi des invitations, suffit à contrôler.",
  },
  {
    title: "2. Le responsable de site ne s'assied pas avec son équipe",
    text: "S'il préside sa tablée, la conversation reste interne et parle du site. Placé là où il n'a personne à encadrer, il devient l'élément le plus utile de la soirée : celui qui fait parler les autres.",
  },
  {
    title: "3. Un ambassadeur par table, prévenu à l'avance",
    text: "Une personne qui sait qu'elle devra présenter ses voisins fait gagner une demi-heure à toute la table. Sans ce rôle, dix convives peuvent rester silencieux jusqu'au dessert.",
  },
  {
    title: "4. Un plan affiché avec des prénoms, sans les sites",
    text: "Indiquer l'origine range les invités par réflexe : chacun cherche sa colonne. Le plan visible ne donne que prénom et numéro de table ; la répartition reste chez l'organisateur.",
  },
];

const arrivees = [
  "Une ouverture à 17h laisse quatre heures pleines avant les derniers départs du soir",
  "L'heure du dernier direct se vérifie ville par ville avant de fixer le service du dessert",
  "Compter deux heures entre le dessert et le train : un service qui glisse ne doit pas faire rater la correspondance",
  "Après 22h, l'entrée se fait par le 59 rue de Ponthieu — à rappeler dans l'invitation",
  "Du lundi au mercredi la maison ferme à minuit ; du jeudi au dimanche, on continue jusqu'à 5h",
];

const formats = [
  {
    title: "Jusqu'à 30 convives : une seule tablée",
    text: "Le dîner tient dans un espace dédié, possible dès dix personnes, et le mélange se fait place par place. Une grande table vaut mieux que trois petites : tout le monde suit la même conversation.",
  },
  {
    title: "De 50 à 150 : privatisation partielle, tables de huit",
    text: "C'est l'effectif où le plan de table devient un vrai travail. Des tables de huit raccourcissent les échanges et multiplient les voisinages ; la partie de salle réservée isole le groupe sans le couper de l'ambiance.",
  },
  {
    title: "De 150 à 250 assis : le menu unique s'impose",
    text: "Le service assis impose une carte resserrée et des tables de dix, où une erreur de plan place cinquante personnes du même côté. Au-delà de 250 convives, le format debout prend le relais, jusqu'à 500 invités.",
  },
];

const paroles = [
  {
    title: "Un seul orateur, huit minutes",
    text: "Le dirigeant parle pour l'ensemble : l'année écoulée, deux chiffres qui concernent tous les sites, une annonce. Passé dix minutes, les tables reprennent leurs discussions.",
  },
  {
    title: "Les responsables de site à table, pas sur scène",
    text: "Leur place est dans la salle, à relancer leur tablée. S'ils doivent être remerciés, une phrase de l'orateur suffit ; cinq passages de six minutes transforment le dîner en réunion avec couverts.",
  },
  {
    title: "Trois prénoms, pas vingt",
    text: "Citer trois personnes et trois faits précis marque plus qu'une liste de vingt noms lue trop vite. C'est la seule séquence que les tables écoutent vraiment.",
  },
];

const creneaux = [
  "17h — accueil debout, badge prénom, plan de table affiché à l'entrée",
  "18h — passage à table et premier service",
  "19h15 — discours unique de huit minutes, entre l'entrée et le plat",
  "20h45 — dessert en place libre pour ceux qui veulent changer de voisin",
  "22h — départs vers les gares ; la salle reste ouverte aux autres",
];

const faq = [
  {
    q: "À quelle heure faut-il faire arriver les équipes venant de province ?",
    a: "Le plus tôt possible après 17h, heure d'ouverture aux groupes. Un accueil debout d'une heure absorbe les retards de train sans décaler le repas, alors qu'un dîner annoncé à 20h se décale au premier convoi en retard et met en péril les correspondances du retour.",
  },
  {
    q: "Peut-on asseoir 120 personnes alors que le lieu accueille 500 personnes debout ?",
    a: "Oui : la capacité assise est d'environ 250 couverts, et la privatisation partielle couvre 50 à 150 convives. Un dîner de 120 personnes occupe donc une partie de la salle, sans que le reste du lieu soit fermé au public.",
  },
  {
    q: "Faut-il engager un animateur professionnel pour un dîner de cohésion ?",
    a: "Rarement. Sur un dîner assis, le plan de table et les ambassadeurs de table font l'essentiel du travail. Un animateur se justifie surtout pour un format debout où les invités circulent, et son coût s'arbitre alors avec celui de la sonorisation.",
  },
  {
    q: "Peut-on cumuler ce dîner avec celui de fin d'année ?",
    a: "C'est possible, mais les deux intentions se contrarient : le dîner de fin d'année célèbre une année écoulée et rassemble souvent les mêmes personnes, tandis qu'un dîner de cohésion cherche à faire parler des équipes qui ne se connaissent pas. Si la date est proche de décembre, mieux vaut choisir l'un des deux objectifs.",
  },
  {
    q: "Comment gérer les régimes alimentaires sur un menu unique ?",
    a: "En les recensant à l'inscription, site par site, et non la veille au téléphone. Un menu unique tolère deux variantes — sans viande, sans porc — préparées à l'avance ; au-delà, le service se ralentit et les tables se retrouvent servies à des moments différents.",
  },
];

export default function DinerCohesionMultiSites() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Dîner de cohésion multi-sites : réunir des équipes qui ne se croisent jamais",
      description:
        "Organiser un dîner de cohésion entre plusieurs sites : plan de table qui mélange les équipes, arrivées échelonnées selon les trains, formats de 30 à 250 convives, dès 17h à Paris 8e.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/diner-cohesion-multi-sites-paris",
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
        title="Dîner de cohésion multi-sites à Paris 8e | Prince Palace"
        description="Réunir les équipes de plusieurs sites le temps d'un dîner : plan de table qui mélange, retours calés sur les trains, formats de 30 à 250. Dès 17h."
        path="/diner-cohesion-multi-sites-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Cocktail servi à l'accueil d'un dîner de cohésion de groupe multi-sites au Prince Palace, avenue des Champs-Élysées"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Cohésion de groupe
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Dîner de cohésion multi-sites : réunir des équipes qui ne se croisent jamais
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Cinq agences, trois entrepôts, deux bureaux régionaux : une fois par an, tout ce monde
            s'assoit dans la même salle. Encore faut-il que les tables ne reconstituent pas
            l'organigramme.
          </p>
          <a
            href={whatsappLink(COHESION_MESSAGE)}
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
            Un groupe dispersé ne fait pas une soirée : il en fait plusieurs, côte à côte
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Dans une entreprise à plusieurs implantations, le manque de cohésion ne vient pas d'un
            défaut de bonne volonté mais de l'absence d'occasions : les équipes se croisent par
            courriel et savent rarement à quoi ressemble le quotidien de l'autre site.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Or le dîner annuel produit souvent l'inverse de ce qu'il visait. À l'apéritif, les
            groupes se reforment par affinité géographique — comme dans un mariage, où les mêmes
            têtes se retrouvent aux mêmes endroits. Au dessert, chacun a parlé à ses voisins
            habituels, dans un lieu plus élégant que le réfectoire.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Le dîner de cohésion multi-sites se juge donc à un indicateur précis : le nombre de
            conversations entre deux sites, pas le nombre de convives. Trois décisions le
            déterminent — la composition des tables, l'heure de retour des équipes lointaines, la
            place laissée à la parole institutionnelle.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Un site ne doit jamais avoir la majorité à une table
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Le plan de table est le seul levier gratuit de la soirée, et le plus déterminant.
          </p>
          <div className="space-y-8">
            {regles.map((r) => (
              <div key={r.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{r.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
          <img
            src={assiette}
            alt="Assiette dressée servie à table sur une banquette du Prince Palace pendant un dîner de cohésion de groupe"
            width={1200}
            height={1500}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mt-10"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            L'heure du dessert se cale sur le dernier train
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Une soirée qui réunit Lille, Lyon et Rennes ne se règle pas sur la montre de ceux qui
            dorment sur place. La logistique des retours décide de l'horaire du repas, bien avant
            le choix du menu.
          </p>
          <ul className="space-y-3 mb-8">
            {arrivees.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Annoncé tôt, le dîner oblige les équipes parisiennes à quitter le bureau en fin
            d'après-midi ; annoncé tard, il condamne les provinciaux à choisir entre le dessert et
            leur train. L'accueil debout dès l'ouverture absorbe les retards de convoi sans décaler
            la suite.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois formats, selon l'effectif réuni
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Le nombre total compte moins que l'effectif par site : c'est lui qui fixe la difficulté
            du mélange.
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
            Un discours de direction, pas un discours par site
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Avec cinq implantations, la tentation est de donner le micro à chaque responsable.
            Cinq fois six minutes, c'est une demi-heure de salle silencieuse au milieu du repas.
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
            Le minutage d'une soirée qui mélange vraiment
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Une soirée tenue de bout en bout, sans temps mort entre l'arrivée et le repas.
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
            Le dessert en place libre est le détail qui change le plus de choses : ceux qui n'ont
            rien trouvé à dire changent de table sans que personne ne le prenne mal.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les informations qui évitent deux allers-retours
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Trois éléments cadrent un devis juste : la date, l'effectif détaillé site par site, et
            l'heure de départ des équipes lointaines. Le format s'en déduit — dîner assis jusqu'à
            environ 250 couverts, cocktail debout jusqu'à 500 personnes, espace dédié dès dix
            convives.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour comparer, voyez le{" "}
            <Link to="/diner-groupe-restaurant-paris" className="text-primary hover:underline">
              dîner de groupe en grande tablée
            </Link>
            , le{" "}
            <Link to="/team-building-restaurant-paris" className="text-primary hover:underline">
              team building au restaurant
            </Link>{" "}
            si la rencontre se joue avant le repas, la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du lieu
            </Link>
            , le{" "}
            <Link to="/diner-fin-annee-entreprise-paris" className="text-primary hover:underline">
              dîner de fin d'année
            </Link>{" "}
            et les{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">
              formules événementielles
            </Link>
            . Renseignements au {SITE.phone} — 76 avenue des Champs-Élysées et 59 rue de Ponthieu,
            Paris 8e.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Organiser la rencontre : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`cohesion-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Fixez la date de la rencontre</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Nombre de convives par site, heure de retour des équipes lointaines, format souhaité :
              demandez un devis, ou réservez directement pour un comité réduit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(COHESION_MESSAGE)}
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
