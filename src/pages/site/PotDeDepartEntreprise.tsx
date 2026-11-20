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
import hero from "@/assets/site/event-soiree.jpg";
import planche from "@/assets/site/restaurant-table.jpg";

const POT_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un pot de départ. Date envisagée : ... / Nombre de convives : ... / Format souhaité (debout, assis ou les deux) : ... / Motif (départ à la retraite, mutation, fin de mission) : ...";

const formats = [
  {
    title: "1. Jusqu'à 20 personnes — le coin de salle",
    text: "Une table d'appoint et un espace debout suffisent. Comptez une heure et demie, une seule prise de parole, et un cadeau remis à table plutôt que devant tout le monde : dans un petit groupe, la mise en scène gêne plus qu'elle n'honore.",
  },
  {
    title: "2. De 20 à 50 — l'espace dédié",
    text: "Le groupe occupe une partie de la salle, avec une zone debout pour l'arrivée puis des tables pour la suite. Deux prises de parole au maximum : un mot du responsable, un mot des collègues, puis le service reprend la main.",
  },
  {
    title: "3. De 50 à 150 — la salle partagée",
    text: "À cette taille, la soirée demande d'être conduite : sonorisation, ordre du jour connu de tous, un référent unique côté entreprise. C'est aussi le format où le pot de départ devient un véritable dîner, avec la bascule vers la piste à minuit.",
  },
];

const rituels = [
  {
    title: "1. Trois minutes, un seul orateur",
    text: "L'improvisation flatte celui qui parle et fatigue ceux qui écoutent. Un texte court, lu, avec un fait précis — une date, un dossier, une manie de bureau — vaut mieux qu'une envolée. Et un seul orateur : trois qui se passent le micro font perdre le fil à toute la salle.",
  },
  {
    title: "2. Le cadeau après les mots, jamais avant",
    text: "Un paquet ouvert avant les discours vide la soirée de son attention : chacun commente, plus personne n'écoute. La remise intervient à la fin, et les remerciements qui suivent constituent le vrai point final. L'ordre inverse laisse un silence gêné au milieu de la pièce.",
  },
  {
    title: "3. Choisir un point fixe pour parler",
    text: "Dans une salle pleine, un orateur sans micro se perd dès la deuxième rangée, et les conversations de fond de salle reprennent en quinze secondes. Un emplacement visible de toutes les tables, face à la lumière plutôt que devant elle, règle à la fois l'acoustique et les photos.",
  },
];

const liste = [
  "Les anciens : convier les partants des deux dernières années transforme la soirée en retrouvailles",
  "La famille : le conjoint est naturel pour une retraite, plus rarement pour une mutation interne",
  "Les clients : leur présence déplace la soirée du registre privé vers la réception professionnelle",
  "Le nombre : l'écart entre les deux estimations successives dépasse souvent trente convives",
];

const horaires = [
  "Lundi, mardi et mercredi : la maison ferme à minuit, le pot tient dans la soirée et chacun rentre",
  "Du jeudi au dimanche : le DJ prend le relais à minuit, la salle reste ouverte jusqu'à 5h",
  "Après 22h, on entre par le 59 rue de Ponthieu, à quelques pas de l'avenue",
  "Un vendredi soir évite de demander à quiconque de travailler le lendemain",
];

const faq = [
  {
    q: "Peut-on organiser un pot de départ tôt dans la soirée ?",
    a: "Oui : les groupes sont reçus à partir de 17h, ce qui laisse une heure debout avant de passer à table, le temps que les retardataires arrivent. Les créneaux se réservent par tranches de trente minutes jusqu'à 5h du matin selon le jour choisi.",
  },
  {
    q: "Combien de convives pouvez-vous recevoir pour un pot de départ ?",
    a: "Un espace dédié est possible dès dix personnes. La privatisation partielle couvre 50 à 150 convives, et la salle entière accueille jusqu'à 500 personnes en cocktail, soit environ 250 couverts en repas assis.",
  },
  {
    q: "Faut-il privatiser le restaurant pour un pot de départ ?",
    a: "Pas pour un groupe courant : un espace dédié suffit jusqu'à une cinquantaine de personnes. La partie de salle devient utile quand les discours ont besoin de silence, et la privatisation totale se justifie au-delà de 150 convives ou si l'entreprise veut maîtriser la musique et l'image projetée.",
  },
  {
    q: "Peut-on faire un pot de départ debout, sans dîner assis ?",
    a: "Oui, c'est même la formule la plus fréquente pour un motif professionnel : un cocktail dinatoire avec pièces à partager, qui laisse les invités circuler. Le passage à table reste possible en seconde partie de soirée, sans avoir à changer de salle.",
  },
  {
    q: "Un départ à la retraite peut-il réunir la famille et les anciens collègues ?",
    a: "C'est le cas de figure le plus courant pour une retraite. Il vaut mieux le signaler au moment du devis : la proportion d'invités extérieurs à l'entreprise détermine la disposition des tables et le moment où le discours est prononcé, plutôt qu'en fin de soirée.",
  },
  {
    q: "Combien de temps prévoir pour le discours et la remise du cadeau ?",
    a: "Comptez dix à quinze minutes au total pour une prise de parole courte, les remerciements et la remise. Prévoyez ce temps dans le déroulé plutôt que de l'improviser entre deux plats, et placez-le après le service du plat principal, quand la salle est encore attablée.",
  },
];

export default function PotDeDepartEntreprise() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Pot de départ d'entreprise à Paris, aux Champs-Élysées",
      description:
        "Pot de départ, retraite ou fin de mission : un format entre le pot improvisé et le dîner assis, dès 17h aux Champs-Élysées. Devis groupe.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/pot-de-depart-entreprise-paris",
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
        title="Pot de départ d'entreprise à Paris 8e | Prince Palace"
        description="Pot de départ, retraite ou fin de mission : le format entre le pot improvisé et le dîner assis, dès 17h aux Champs-Élysées. Devis groupe."
        path="/pot-de-depart-entreprise-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Verre à la main lors d'un pot de départ entre collègues au Prince Palace, Champs-Élysées"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Vie d'équipe
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Pot de départ d'entreprise à Paris, aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            La personne qui s'en va est le seul sujet de la soirée : un format entre le pot improvisé
            et le dîner assis, de dix convives à la salle entière.
          </p>
          <a
            href={whatsappLink(POT_MESSAGE)}
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
            Un pot de départ n'est ni un afterwork ni un dîner
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un afterwork réunit ceux qui restent après le travail. Un pot de départ réunit des
            personnes qui, pour une partie d'entre elles, ne se reverront plus. La nuance paraît
            légère et elle change tout dans la préparation : la moitié des invités a quitté
            l'entreprise depuis des années, quelques-uns n'ont jamais travaillé avec la personne
            fêtée, et certains viennent de loin pour une seule soirée.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Il en découle une contrainte de déroulé. Les arrivées s'étalent, les retrouvailles se
            font debout, autour d'un verre, et le seul moment qui exige que tout le monde soit
            présent — les mots puis la remise du cadeau — se place tard, jamais à l'ouverture des
            portes. Un pot de départ réussi est une soirée à deux temps, dont le second commence
            quand le premier s'essouffle.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Reste une question rarement posée à voix haute : qui décide du format. C'est presque
            toujours celui ou celle qui organise, sans mandat clair ni budget arrêté. Savoir à quelle
            taille une salle devient nécessaire, et combien de temps tient une prise de parole, évite
            trois réunions qui n'aboutissent pas.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois formats, et ce qui change à chaque palier
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Le nombre de convives ne détermine pas seulement la taille de la table : il fixe le
            nombre de personnes qui prendront la parole, donc l'ambiance de la soirée.
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
            Les mots : la seule partie qui ne se rattrape pas
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un discours mal placé reste dans les mémoires de la soirée entière, et aucun ajustement de
            dernière minute ne le rattrape. Trois précautions suffisent.
          </p>
          <div className="space-y-8 mb-8">
            {rituels.map((r) => (
              <div key={r.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{r.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
          <img
            src={planche}
            alt="Planche à partager posée sur une table du Prince Palace pendant un pot de départ"
            width={1600}
            height={1200}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            La liste d'invités, arbitrage le plus délicat
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            On prépare un menu en une réunion ; la liste des invités, elle, se discute pendant deux
            semaines. Quatre points reviennent à chaque fois, et méritent d'être tranchés avant de
            demander un devis.
          </p>
          <ul className="space-y-3 mb-8">
            {liste.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Une règle simple évite les corrections de dernière minute : fixer une date limite de
            réponse et considérer les absents comme tels. Ceux qui attendent le nombre exact
            arbitrent la veille, souvent en réduisant un format déjà prévu plus large.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            De 17h aux premières heures du matin
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            L'ouverture aux groupes à 17h tombe à l'heure où les bureaux se vident : le pot peut
            commencer sans que personne n'ait à poser une demi-journée. La fin, elle, se choisit avec
            le jour de la semaine.
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
            Un mercredi ferme à minuit, ce qui convient à une retraite où les conjoints sont
            présents. Un jeudi ou un vendredi laisse la place à ceux qui veulent prolonger.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce que l'équipe demande pour chiffrer la soirée
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Trois informations font gagner un aller-retour : la date visée, le nombre de convives, et
            le format — debout, assis, ou les deux à la suite. Le nombre fixe le volume : un espace
            dédié dès dix personnes, une partie de salle entre 50 et 150, l'ensemble du lieu jusqu'à
            500 en cocktail et environ 250 couverts en repas assis. Le motif du départ compte aussi :
            une retraite se fête avec les familles, une mutation interne reste un rendez-vous
            d'équipe.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour comparer les formats voisins, voyez l'
            <Link to="/afterwork-paris-champs-elysees" className="text-primary hover:underline">
              afterwork aux Champs-Élysées
            </Link>{" "}
            quand la soirée reste entre collègues, la{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise
            </Link>{" "}
            pour un rendez-vous annuel, le{" "}
            <Link to="/diner-groupe-restaurant-paris" className="text-primary hover:underline">
              dîner de groupe
            </Link>{" "}
            pour une grande tablée, et la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du restaurant
            </Link>{" "}
            pour les niveaux d'exclusivité. Les{" "}
            <Link to="/restaurant-ouvert-tard-paris" className="text-primary hover:underline">
              horaires jusqu'à 5h
            </Link>{" "}
            et les{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">
              formules événementielles
            </Link>{" "}
            sont détaillés ailleurs sur le site. Renseignements au {SITE.phone}, 76 avenue des
            Champs-Élysées et 59 rue de Ponthieu, Paris 8e.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">
            Pot de départ : vos questions
          </h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`pot-faq-${i}`} className="border-primary/15">
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
              Fixez la date du pot de départ
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, nombre de convives, format debout ou assis : demandez un devis, ou réservez
              directement pour un groupe plus réduit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(POT_MESSAGE)}
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
