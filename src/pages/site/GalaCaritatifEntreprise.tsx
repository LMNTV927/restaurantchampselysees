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
import hero from "@/assets/site/privatisation.jpg";
import assiette from "@/assets/site/detail-table.jpg";

const GALA_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un gala caritatif. Date envisagée : ... / Nombre de convives : ... / Format (debout, assis ou les deux) : ... / Association bénéficiaire : ...";

const temps = [
  {
    title: "À l'arrivée, la vente silencieuse",
    text: "Entre l'ouverture et le passage à table, les invités circulent debout, un verre à la main. C'est la seule fenêtre où ils acceptent de s'arrêter devant une table, de lire des lots et de remplir un bulletin. Comptez une trentaine de minutes réellement utiles : au-delà, les premiers arrivés s'impatientent et l'on se met à table avant que les derniers aient vu l'ensemble des lots.",
  },
  {
    title: "Entre le plat et le dessert, l'appel aux dons",
    text: "La salle est assise, servie, et personne n'a encore envie de partir. Un appel de six à huit minutes, avec un objectif annoncé à voix haute et un premier don amorcé par un invité prévenu, porte mieux qu'un long plaidoyer. Attendre le dessert pour solliciter fait perdre l'essentiel de l'effet : les esprits sont déjà tournés vers la sortie.",
  },
  {
    title: "Après le dessert, la tombola et le mot de clôture",
    text: "La tombola ne collecte pas beaucoup, et ce n'est pas son rôle : elle sert à terminer sur une note légère après la sollicitation. Le montant réuni et les remerciements s'annoncent à ce moment-là, quand la salle est encore pleine, jamais après les premiers départs.",
  },
];

const plan = [
  "Une scène unique, face aux tables : un dispositif central coupe la salle en deux et prive la moitié des convives de l'image",
  "Les tables de donateurs dans les dix premiers mètres : la générosité se propage de proche en proche, rarement depuis le fond",
  "Des allées larges : le service passe sans interrompre une prise de parole, et les bulletins circulent sans faire lever personne",
  "Les points de collecte à distance du bar : un stand collé au comptoir transforme la file d'attente en embouteillage",
];

const formats = [
  {
    title: "1. Cocktail debout, jusqu'à 500 personnes",
    text: "Le format des galas dont la collecte repose sur la vente silencieuse et le contact direct : les invités circulent, arrivent et repartent à leur heure. En contrepartie, la salle n'est jamais réunie pour écouter, donc l'appel aux dons y perd sa force.",
  },
  {
    title: "2. Dîner assis, environ 250 couverts",
    text: "C'est le format qui rend les trois temps de collecte possibles. Il impose de fixer une heure de passage à table et de s'y tenir : à partir de là, le programme se déroule, et non l'inverse.",
  },
  {
    title: "3. Les deux à la suite, dîner puis piste",
    text: "Le déroulé le plus fréquent pour un gala d'entreprise : repas assis, remise du chèque, puis la salle se libère. Du jeudi au dimanche, la piste prend le relais à minuit et la maison reste ouverte jusqu'à 5h.",
  },
];

const creneaux = [
  "17h — ouverture, accueil debout et vente silencieuse",
  "19h30 — passage à table, service de l'entrée",
  "21h — appel aux dons et témoignage, avant le dessert",
  "22h15 — tombola, annonce du montant, remerciements",
  "23h — bascule vers la piste, ou sortie",
];

const faq = [
  {
    q: "Peut-on organiser un gala caritatif un jour de semaine ?",
    a: "Oui : les groupes sont reçus à partir de 17h, ce qui laisse le temps de monter la vente silencieuse avant le dîner. Du lundi au mercredi la maison ferme à minuit, ce qui convient à un gala de semaine ; du jeudi au dimanche, la soirée peut se prolonger jusqu'à 5h.",
  },
  {
    q: "Combien de convives pouvez-vous accueillir pour un dîner de gala ?",
    a: "Environ 250 couverts en repas assis, et jusqu'à 500 personnes en formule cocktail. La privatisation partielle couvre 50 à 150 convives, la salle entière permettant de réunir l'ensemble des invités sans mélange avec le service courant.",
  },
  {
    q: "Faut-il privatiser entièrement le restaurant pour un gala ?",
    a: "Dès que la soirée comporte un appel aux dons, la réponse penche vers oui : une sollicitation a besoin de silence, et le bruit d'un service voisin suffit à la rendre inaudible. En dessous de 150 convives, une partie de salle peut suffire si le programme reste debout.",
  },
  {
    q: "Peut-on projeter une vidéo de l'association pendant la soirée ?",
    a: "Cela se cale au devis, en même temps que la sonorisation et le nombre de micros : l'équipement n'est pas standard d'une soirée à l'autre. Signalez la durée de la séquence et le format du fichier dès la demande, plutôt qu'en semaine d'événement.",
  },
  {
    q: "Comment gérer les invités qui ne restent pas jusqu'à la fin ?",
    a: "Placez les temps de collecte avant 22h30 : au-delà, une partie des convives a déjà quitté la salle, et l'annonce du montant se fait devant un auditoire réduit. Le format assis aide, puisqu'il donne à chacun une heure d'arrivée et une heure de départ lisibles.",
  },
  {
    q: "Un gala avec dîner et soirée dansante tient-il dans la même salle ?",
    a: "Oui, c'est la configuration la plus courante : tables puis piste, sans changement de lieu. La bascule demande simplement de prévoir le rangement des tables dans le minutage, et de placer la remise du chèque avant que la salle ne se transforme.",
  },
];

export default function GalaCaritatifEntreprise() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Gala caritatif d'entreprise à Paris, aux Champs-Élysées",
      description:
        "Gala de charité d'entreprise : placer les trois temps de collecte, choisir le plan de salle, tenir le programme. Dîner assis ou cocktail, dès 17h à Paris 8e.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/gala-caritatif-entreprise-paris",
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
        title="Gala caritatif d'entreprise à Paris 8e | Prince Palace"
        description="Gala de charité : placer les temps de collecte, choisir le plan de salle, tenir le programme. Dîner assis ou cocktail, dès 17h aux Champs-Élysées."
        path="/gala-caritatif-entreprise-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Assiettes dressées sur une nappe blanche lors d'un dîner de gala au Prince Palace, Champs-Élysées"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Soirée de collecte
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Gala caritatif d'entreprise à Paris, aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Une soirée dont l'objectif n'est pas seulement de réunir du monde, mais de réunir des
            fonds : le programme se construit autour de trois moments de collecte, et le reste
            s'organise autour d'eux.
          </p>
          <a
            href={whatsappLink(GALA_MESSAGE)}
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
            Un gala de charité n'est pas une soirée d'entreprise
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Une soirée d'entreprise se juge à l'ambiance qu'elle laisse le lendemain. Un gala
            caritatif se juge à un chiffre, celui de la collecte, et à l'image qu'il donne à
            l'organisateur. Les deux se ressemblent — même salle, même service, en partie les mêmes
            invités — mais ils n'obéissent pas à la même mécanique : dans un gala, un temps mort
            coûte de l'argent.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La conséquence est contre-intuitive. On imagine qu'il faut allonger le dîner pour
            laisser la salle « entrer dans l'ambiance » ; en pratique, plus le repas s'étire, plus
            les conversations se dispersent et plus la sollicitation tombe dans le brouhaha. Un
            gala réussi est un gala court, dont les temps de collecte arrivent quand l'attention est
            déjà captée par autre chose que la table voisine.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Troisième différence, souvent découverte le soir même : les invités ne se connaissent
            pas tous. Un gala réunit des collaborateurs, des partenaires, des donateurs habitués et
            quelques invités d'honneur. Une table de dix personnes qui ne se sont jamais vues ne
            réagit pas au même moment qu'une tablée de collègues, et le plan de table doit en tenir
            compte avant le jour J.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            La collecte se joue dans les interstices du repas
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            L'argent ne se lève pas pendant qu'on mange. Il se lève dans les trois moments où la
            salle est disponible sans être distraite par autre chose.
          </p>
          <div className="space-y-8">
            {temps.map((t) => (
              <div key={t.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{t.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Le plan de salle décide du montant collecté
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Dans une salle de 250 couverts, une table au fond perçoit l'estrade comme un écran sans
            son. Ce n'est pas une affaire de puissance de sonorisation, mais de disposition : voici
            les quatre points qui reviennent à chaque gala.
          </p>
          <ul className="space-y-3 mb-8">
            {plan.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <img
            src={assiette}
            alt="Assiette dressée servie à table dans la salle du Prince Palace, dîner de gala assis"
            width={1200}
            height={1500}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
          <p className="text-muted-foreground leading-relaxed mt-8">
            Ces quatre points se tranchent au moment du devis, pas le jour de l'installation. Une
            disposition validée en amont évite la réorganisation de dernière minute, qui se paie
            toujours en minutes de programme perdues.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Assis ou debout : le format fixe le programme
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Le choix ne relève pas du nombre de convives seul, mais de ce que la soirée doit
            produire. Un gala debout et un gala assis ne collectent pas de la même manière.
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
            Le déroulé, heure par heure
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Les groupes sont reçus dès 17h, ce qui permet de monter la vente silencieuse avant le
            dîner. Voici un minutage de référence pour un gala assis qui commence en début de
            soirée.
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
            Ce minutage se décale si le gala commence plus tard, mais l'ordre des séquences ne
            change pas : on ne sollicite jamais une salle encore debout, et on ne remercie jamais
            après le départ des premiers invités. Après 22h, l'accès se fait par le 59 rue de
            Ponthieu, à quelques pas de l'avenue — un point à rappeler dans le carton d'invitation
            autant que dans le message aux retardataires.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce qu'il faut réunir avant de demander un devis
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Quatre informations font gagner un aller-retour : la date visée, le nombre de convives,
            le format — debout, assis, ou les deux à la suite — et l'heure souhaitée de passage à
            table. Le nombre fixe ensuite le volume : un espace dédié dès dix personnes, une partie
            de salle entre 50 et 150, l'ensemble du lieu jusqu'à 500 personnes en cocktail et
            environ 250 couverts en repas assis. L'association bénéficiaire compte aussi : elle
            détermine la durée des prises de parole et la place du témoignage.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour situer le format, voyez la{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise
            </Link>{" "}
            quand la dimension caritative n'est pas centrale, le{" "}
            <Link to="/diner-groupe-restaurant-paris" className="text-primary hover:underline">
              dîner de groupe
            </Link>{" "}
            pour une grande tablée sans collecte, le{" "}
            <Link to="/cocktail-dinatoire-paris" className="text-primary hover:underline">
              cocktail dînatoire
            </Link>{" "}
            pour un gala debout, et la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du restaurant
            </Link>{" "}
            pour les niveaux d'exclusivité. La{" "}
            <Link to="/soiree-dansante-paris" className="text-primary hover:underline">
              bascule vers la piste
            </Link>{" "}
            et les{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">
              formules événementielles
            </Link>{" "}
            sont détaillées ailleurs sur le site. Renseignements au {SITE.phone}, 76 avenue des
            Champs-Élysées et 59 rue de Ponthieu, Paris 8e.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Gala caritatif : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`gala-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Fixez la date du gala</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, nombre de convives, format et heure de passage à table : demandez un devis, ou
              réservez directement pour un groupe plus réduit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(GALA_MESSAGE)}
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
