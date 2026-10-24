import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/event-soiree.jpg";
import ambiance from "@/assets/site/hero-lounge.jpg";

const DANSANTE_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser une soirée dansante. Date souhaitée : ... / Nombre de personnes : ... / Dîner assis ou cocktail avant la piste : ... / Heure de fin envisagée : ...";

const faq = [
  {
    q: "Faut-il privatiser le lieu pour organiser une soirée dansante ?",
    a: "Non, ce n'est pas une condition. Un groupe à partir de dix personnes peut disposer d'un espace dédié avec ses tables, puis rejoindre la piste au moment de la bascule. La privatisation partielle, de 50 à 150 personnes, garde au contraire le groupe entre lui toute la soirée, ce qui change la façon de danser : on reste entre collègues ou entre amis, sans se mélanger au reste de la salle.",
  },
  {
    q: "Quels soirs permettent de danser le plus longtemps ?",
    a: "Du jeudi au dimanche, la salle reste ouverte jusqu'à 5h et le DJ prend le relais à partir de minuit : c'est la configuration qui laisse le plus de temps sur la piste. Du lundi au mercredi, la fermeture intervient à minuit, donc la partie dansante doit tenir dans une fenêtre plus courte, après le dîner.",
  },
  {
    q: "Peut-on venir uniquement pour la partie dansante, sans dîner ?",
    a: "Cela se décide avec l'équipe, et non par une simple réservation de table : l'accès à la partie club n'est pas automatique avec une réservation au restaurant. Précisez-le dans la demande de devis en indiquant l'heure d'arrivée souhaitée, pour que la formule proposée corresponde réellement à votre projet.",
  },
  {
    q: "Peut-on imposer sa propre playlist ?",
    a: "Vous pouvez transmettre des indispensables et des interdits, mais pas une programmation minute par minute : un DJ lit la salle et adapte les transitions, ce qu'aucune liste figée ne permet. Le plus efficace est d'indiquer trois ambiances — le dîner, la montée, la fin de nuit — avec cinq ou six titres de référence pour chacune.",
  },
  {
    q: "Combien de personnes faut-il pour réserver un espace et danser ?",
    a: "Un espace dédié avec tables et assises est attribué dès dix personnes. Entre 50 et 150 invités, la privatisation partielle isole votre groupe dans une partie identifiée du lieu ; au-delà, la privatisation totale mobilise l'ensemble de la salle, jusqu'à 500 personnes debout.",
  },
  {
    q: "Comment les invités entrent-ils en fin de soirée ?",
    a: "L'adresse principale est le 76 avenue des Champs-Élysées, à quelques minutes des métros George V et Franklin D. Roosevelt. À partir de 22h, l'entrée bascule au 59 rue de Ponthieu : cette information doit figurer dans le message envoyé aux invités, sinon les retardataires se présentent devant une porte qui ne correspond plus à l'adresse indiquée.",
  },
];

const reperes = [
  "Ouverture à 17h, réservation par créneaux de 30 minutes : l'heure d'arrivée se fixe à l'avance",
  "Lundi à mercredi : fermeture à minuit, donc une partie dansante courte après le dessert",
  "Jeudi à dimanche : ouverture jusqu'à 5h, avec le DJ à partir de minuit",
  "Après 22h, l'accès se fait par le 59 rue de Ponthieu, la seconde adresse du lieu",
  "Groupes dès 10 personnes ; privatisation partielle de 50 à 150, totale jusqu'à 500",
];

const deroule = [
  "18h00 — arrivée échelonnée par créneaux : les premiers occupent le bar",
  "19h30 — dîner servi, musique en fond à un niveau qui laisse encore parler",
  "22h00 — dessert et café : le service s'allège, la salle peut commencer à bouger",
  "22h30 — bascule : les tables du centre sont dégagées, le volume monte progressivement",
  "Minuit — passage au DJ du jeudi au dimanche : le groupe qui dînait devient un groupe qui danse",
  "Jusqu'à 5h — fin de nuit pour ceux qui restent, bar toujours accessible aux autres",
];

const configurations = [
  {
    title: "Espace dédié, de 10 à 50 personnes",
    text: "Vos tables sont regroupées dans une zone identifiée : vous dînez entre vous, puis vous rejoignez la piste commune à la bascule. La formule la plus simple et la plus économique, mais la piste n'est pas réservée.",
  },
  {
    title: "Privatisation partielle, de 50 à 150 personnes",
    text: "Une partie du lieu est consacrée à votre événement, avec son flux d'invités et son espace de danse. Le groupe reste entre lui toute la soirée, avec sa programmation et son niveau sonore. Le format des anniversaires et des soirées qui ne veulent pas se mélanger à la clientèle.",
  },
  {
    title: "Privatisation totale, jusqu'à 500 personnes",
    text: "Tout le lieu est à vous : entrée maîtrisée, nom de l'événement, déroulé calé sur votre programme. La piste devient le cœur de la soirée, donc le timing doit tenir : si le dîner déborde, la moitié des invités part avant le premier morceau.",
  },
];

const brief = [
  "Trois tempos plutôt qu'une liste : fond sonore au dîner, montée après le dessert, bloc de nuit à minuit",
  "Cinq à six titres de référence par tempo : au-delà, le DJ ne peut plus lire la salle",
  "Les interdits comptent autant que les demandes — un morceau qui vide la piste se repère vite",
  "Un titre que tout le monde connaît au moment de la bascule amorce mieux le mouvement qu'une programmation parfaite",
];

const nonDanseurs = [
  "Garder tables et assises accessibles toute la soirée : ceux qui ne dansent pas ne doivent pas finir au bar",
  "Ne pas pousser le volume au maximum dès la bascule : il faut un bord de piste où l'on peut se parler",
  "Prévoir des allers-retours plutôt qu'une frontière : on danse un titre, on revient s'asseoir, on repart",
  "Annoncer l'heure de bascule dans l'invitation, pour que chacun sache quand la salle change de nature",
];

export default function SoireeDansante() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Soirée dansante à Paris : faire réellement danser un groupe",
      description:
        "Soirée dansante aux Champs-Élysées : dîner, bascule vers la piste, DJ dès minuit et horaires réels. Groupes dès 10 personnes, devis rapide.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/soiree-dansante-paris",
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
      url: "https://restaurantchampselysees.fr/soiree-dansante-paris",
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
        title="Soirée dansante à Paris 8e : dîner puis piste jusqu'à 5h"
        description="Soirée dansante aux Champs-Élysées : dîner, bascule vers la piste, DJ dès minuit et horaires réels. Groupes dès 10 personnes, devis rapide."
        path="/soiree-dansante-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Verre de cocktail tenu à la main pendant une soirée dansante au Prince Palace, Champs-Élysées, Paris 8e"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Soirée dansante</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Soirée dansante à Paris : faire réellement danser un groupe
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Dîner au 76 avenue des Champs-Élysées, puis la salle se libère et devient piste, avec DJ à
            partir de minuit du jeudi au dimanche. Ce qui fait la différence, c'est l'heure de bascule.
          </p>
          <a
            href={whatsappLink(DANSANTE_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Organiser notre soirée
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Entre le dessert et la première danse, il y a un moment à organiser
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Une soirée annoncée comme dansante ne l'est jamais automatiquement. À 22h45, les assiettes
            sont vides, le service ralentit, la musique monte d'un cran — et personne ne bouge. Le
            groupe attend un signal qui n'a pas été prévu.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La bascule, c'est ce moment où le mobilier s'écarte, où le volume s'installe et où un
            premier morceau fédérateur fait lever quatre personnes que les autres suivent. Elle se
            décide au devis, pas à 23h entre deux cafés.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Restent trois choses à régler à l'avance : les horaires réels du lieu, le déroulé jusqu'au
            premier morceau et la place laissée à ceux qui ne dansent pas.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les horaires décident de la soirée avant le DJ
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Avant de choisir un thème ou un DJ, regardez le calendrier : la durée possible de la partie
            dansante n'est pas la même en début et en fin de semaine. Les repères ci-dessous sont ceux
            du lieu.
          </p>
          <ul className="space-y-3 mb-8">
            {reperes.map((r) => (
              <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Concrètement : un lundi, la danse occupe une fenêtre étroite après le repas, entre 22h et
            minuit. Un vendredi, la même tablée enchaîne dîner puis nuit entière sur place, sans second
            lieu à chercher à 1h du matin.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Le déroulé d'une soirée qui finit sur la piste
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un ordre de grandeur, calé sur l'ouverture à 17h : il n'est pas obligatoire, mais il évite
            la panne du milieu de soirée.
          </p>
          <ul className="space-y-3 mb-8">
            {deroule.map((d) => (
              <li key={d} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {d}
              </li>
            ))}
          </ul>
          <img
            src={ambiance}
            alt="Cocktail servi au bar pendant une soirée dansante aux Champs-Élysées, Paris 8e"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois configurations, trois façons de danser
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Le niveau d'exclusivité ne change pas seulement le confort : il change la nature même de la
            piste.
          </p>
          <div className="space-y-8">
            {configurations.map((c) => (
              <div key={c.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{c.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Briefer le DJ : trois tempos plutôt qu'une playlist
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Envoyer deux cents titres est la meilleure façon d'obtenir une soirée qui ne ressemble à
            rien. Un DJ travaille par paliers et par lecture du public : il lui faut des repères, pas
            une grille.
          </p>
          <ul className="space-y-3 mb-8">
            {brief.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les non-danseurs ne sont pas un détail
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Dans un groupe de quarante personnes, comptez une bonne moitié qui ne montera pas sur la
            piste, et plusieurs qui partiront si l'espace ne leur laisse plus de place. Une soirée
            réussie est aussi une soirée assise réussie : les deux publics doivent coexister.
          </p>
          <ul className="space-y-3">
            {nonDanseurs.map((n) => (
              <li key={n} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {n}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Ce qui se règle avant de bloquer la date</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            L'effectif désigne la configuration, pas l'inverse. Le format du dîner — assis ou debout —
            détermine l'heure à laquelle la piste peut s'ouvrir. Le budget se chiffre à l'avance : une
            privatisation s'annonce dès le devis, un forfait boissons évite les arbitrages de fin de
            nuit. Les contraintes alimentaires, elles, se collectent avec la liste des invités.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour situer ce format, la page
            <Link to="/evenementiel" className="text-primary hover:underline"> événementiel </Link>
            donne la vue d'ensemble, la
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              {" "}privatisation du restaurant{" "}
            </Link>
            compare les niveaux d'exclusivité, et l'
            <Link to="/afterwork-paris-champs-elysees" className="text-primary hover:underline">
              afterwork
            </Link>{" "}
            détaille la version courte. Pour une fête privée, voyez l'
            <Link to="/anniversaire-restaurant-paris" className="text-primary hover:underline">
              anniversaire au restaurant
            </Link>
            ; pour un groupe qui préfère rester à table, le
            <Link to="/diner-groupe-restaurant-paris" className="text-primary hover:underline">
              {" "}dîner de groupe en grande table{" "}
            </Link>
            . L'
            <Link to="/galerie" className="text-primary hover:underline">aperçu en images</Link> donne
            une idée des volumes.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le lieu se situe au 76 avenue des Champs-Élysées, complété par le 59 rue de Ponthieu, dans
            le 8e. Les métros George V et Franklin D. Roosevelt sont à quelques minutes, avec des
            parkings publics à proximité. Capacité : 500 personnes debout, environ 250 convives assis.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour un projet de soirée dansante à partir de dix personnes, un interlocuteur unique suit
            le dossier :{" "}
            <a href={SITE.phoneHref} className="text-primary hover:underline">
              {SITE.phone}
            </a>
            .
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Soirée dansante : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`danse-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Votre soirée dansante aux Champs-Élysées</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, effectif, format du dîner et heure de fin envisagée : avec ces éléments, vous
              recevez un déroulé et une proposition chiffrée.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(DANSANTE_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis soirée dansante
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
