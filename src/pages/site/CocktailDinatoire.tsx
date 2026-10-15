import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/hero-lounge.jpg";
import ambiance from "@/assets/site/vibe-2.jpg";

const COCKTAIL_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un cocktail dînatoire. Date souhaitée : ... / Nombre d'invités : ... / Heure de début et de fin : ... / Format souhaité (pièces à passer, stations, tables assises) : ... / Contraintes (prises de parole, allergies, régimes) : ...";

const faq = [
  {
    q: "Combien d'invités un cocktail dînatoire peut-il réunir au Prince Palace ?",
    a: "Le lieu accueille jusqu'à 500 personnes debout en configuration cocktail, et environ 250 convives si des places assises sont dressées en complément. Un espace dédié est réservé à votre groupe dès 10 personnes, la privatisation partielle convient de 50 à 150 invités et la privatisation totale ouvre l'ensemble du restaurant.",
  },
  {
    q: "À quelle heure peut débuter un cocktail dînatoire ?",
    a: "L'établissement ouvre à 17h et la réservation en ligne fonctionne par créneaux de 30 minutes, ce qui permet de fixer une heure d'arrivée précise. Du lundi au mercredi la salle ferme à minuit ; du jeudi au dimanche l'ouverture se prolonge jusqu'à 5h, avec DJ à partir de minuit.",
  },
  {
    q: "Faut-il choisir entre pièces à passer et stations ?",
    a: "Les deux se pratiquent, et souvent les deux se combinent : le service à la pièce crée du mouvement entre les invités, une station fixe désengorge les pics d'affluence et règle la question des invités qui arrivent en décalé. Le format se cale lors de la demande de devis, en fonction de votre budget et du nombre d'invités.",
  },
  {
    q: "Peut-on prévoir quelques tables assises pendant un cocktail ?",
    a: "Oui. Le lieu compte environ 250 places assises : quelques tables dressées en complément du cocktail rendent service aux invités qui ne restent pas debout toute la soirée, aux délégations à regrouper ou aux repas à marquer. Le nombre de tables, de mange-debout et leur emplacement se valident avant l'événement.",
  },
  {
    q: "Comment vos invités accèdent-ils au lieu ?",
    a: "L'adresse est le 76 avenue des Champs-Élysées, avec une entrée à l'angle au 59 rue de Ponthieu, Paris 8e. Après 22h, l'accès se fait par le 59 rue de Ponthieu. Les métros George V et Franklin D. Roosevelt ainsi que plusieurs parkings publics se trouvent à quelques minutes.",
  },
  {
    q: "Une prise de parole est-elle possible pendant le cocktail ?",
    a: "Les besoins techniques — sonorisation, micros, écran, connexion — sont validés avec l'équipe au moment de la demande de devis, pour vous indiquer précisément ce qui est disponible sur place. Un prestataire extérieur peut également être accueilli pour installer un matériel spécifique.",
  },
];

const formats = [
  {
    title: "Cocktail dînatoire intégral, debout",
    text: "Les invités arrivent, circulent et se servent sans contrainte de placement : c'est le format qui absorbe le mieux les effectifs importants, jusqu'à 500 personnes, tout en laissant chacun libre de ses conversations et de ses rencontres.",
  },
  {
    title: "Cocktail complété de quelques tables assises",
    text: "Quelques tables dressées en complément du cocktail rendent service aux invités qui ne tiennent pas toute la soirée debout, aux délégations à regrouper ou aux repas à marquer. Le lieu compte environ 250 places assises en configuration mixte.",
  },
  {
    title: "Formule privatisation partielle (50 à 150 personnes)",
    text: "Votre réception disposée dans un espace identifié, avec vos invités qui restent entre eux : c'est le format courant d'un cocktail d'entreprise, d'un lancement ou d'une soirée de fin de trimestre, avec la restauration à proximité immédiate.",
  },
  {
    title: "Privatisation totale, jusqu'à 500 invités",
    text: "L'ensemble du lieu est consacré à votre événement : votre nom partout, un parcours d'arrivée maîtrisé, et la possibilité de faire basculer la fin de soirée en ambiance club. Après 22h, l'entrée se fait par le 59 rue de Ponthieu.",
  },
];

const reperes = [
  "L'arrivée : les quarante-cinq premières minutes concentrent la majorité des arrivées — les pièces froides doivent déjà circuler et le bar rester accessible dès le premier verre",
  "Le cœur du cocktail : le passage régulier des pièces une par une, complété par une ou deux stations fixes pour désengorger les pics de fréquentation",
  "Le mobilier : les organisateurs retiennent souvent un mange-debout pour cinq à six invités, positionnés hors des axes de circulation pour ne jamais bloquer le service",
  "Le dessert et la fin : un signal clair, puis la bascule en soirée dansante pour les groupes qui souhaitent prolonger la réception sur place",
];

const creneaux = [
  "Lundi à mercredi — la salle ferme à minuit : cocktail de 17h à 23h, terminé avant la nuit",
  "Jeudi à dimanche — ouverture jusqu'à 5h : la réception se prolonge et la salle bascule en ambiance club avec DJ à partir de minuit",
  "Après 22h — l'accès se fait par le 59 rue de Ponthieu, ce qui simplifie l'arrivée tardive de vos derniers invités",
  "Créneaux de 30 minutes — chaque invitation peut indiquer une heure d'arrivée précise, utile pour lisser l'affluence au vestiaire et au bar",
];

export default function CocktailDinatoire() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Cocktail dînatoire à Paris 8e : réception debout aux Champs-Élysées",
      description:
        "Cocktail dînatoire à Paris 8e : réception debout aux Champs-Élysées jusqu'à 500 invités dès 17h, pièces à passer et stations. Devis pour votre groupe.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/cocktail-dinatoire-paris",
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
      url: "https://restaurantchampselysees.fr/cocktail-dinatoire-paris",
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
        title="Cocktail dînatoire Paris 8e : réception Champs-Élysées"
        description="Cocktail dînatoire à Paris 8e : réception debout aux Champs-Élysées jusqu'à 500 invités dès 17h, pièces à passer et stations. Devis pour votre groupe."
        path="/cocktail-dinatoire-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Salle lounge du Prince Palace aménagée pour un cocktail dînatoire aux Champs-Élysées à Paris 8e"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Réceptions debout</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Cocktail dînatoire à Paris 8e : recevoir debout aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Un lieu lounge de 500 places debout à deux pas du rond-point des Champs-Élysées, ouvert
            dès 17h — et jusqu'à 5h du jeudi au dimanche pour les groupes qui prolongent la soirée.
          </p>
          <a
            href={whatsappLink(COCKTAIL_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Construire mon cocktail
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Recevoir debout, c'est d'abord libérer la conversation
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un cocktail dînatoire n'est pas un dîner auquel on aurait retiré les chaises : c'est une
            autre manière de recevoir. Les invités circulent, se croisent, se présentent sans
            intermédiaire, et l'on ne décide plus à l'avance qui sera assis à côté de qui. Dans un
            lieu de 500 places debout comme le Prince Palace, au 76 avenue des Champs-Élysées, ce
            format sert aussi bien un lancement de produit qu'un cocktail d'entreprise, un
            anniversaire de société ou un afterwork élargi.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le second avantage tient au temps. Un repas assis s'étire rarement au-delà de deux heures
            trente sans lasser ; une réception debout se déploie naturellement sur trois à quatre
            heures, avec ses moments forts — l'arrivée, le passage des pièces chaudes, le dessert, la
            bascule en soirée dansante. Personne n'est prisonnier d'une place, et rien ne s'arrête
            parce qu'un convive doit partir plus tôt.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Reste une condition, et c'est elle qui fait la différence entre un bon cocktail et une
            soirée confuse : le flux. Un bar saturé, un plateau qui n'arrive jamais, une salle trop
            serrée, et l'ambiance retombe. La suite de cette page détaille justement les points
            logistiques à cadrer avant de fixer la date.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Quatre configurations de réception debout
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Le format se choisit selon le nombre d'invités et le message que vous voulez faire passer
            — soirée détendue entre collègues ou réception représentative.
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
            Construire le parcours des pièces et le flux de service
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Une réception debout réussie se joue sur un enchaînement simple : on accueille, on
            abreuve, on nourrit, on prolonge. Voici les repères qui reviennent dans presque tous les
            cocktails dînatoires organisés ici.
          </p>
          <ul className="space-y-3 mb-8">
            {reperes.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Le volume de pièces par invité dépend du moment de la soirée et du type de service
            retenu : il se calcule avec vous lors de la demande de devis, plutôt que sur une
            moyenne théorique. Mieux vaut un léger excédent en début de réception qu'une rupture au
            moment où la salle est la plus pleine.
          </p>
          <img
            src={ambiance}
            alt="Invités debout et mange-debout lors d'un cocktail dînatoire dans un restaurant lounge des Champs-Élysées"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Le créneau change tout : de 17h à minuit, ou jusqu'à 5h
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Le créneau horaire dessine la soirée autant que le lieu lui-même : c'est le point à
            trancher avant tout le reste, avant même de choisir un menu.
          </p>
          <ul className="space-y-3 mb-6">
            {creneaux.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Un cocktail en début de semaine se termine proprement à minuit ; en fin de semaine, du
            jeudi au dimanche, la salle reste ouverte jusqu'à 5h et les invités qui le souhaitent
            poursuivent la soirée après le passage du DJ à minuit. Dans les deux cas, le créneau de
            réservation se choisit par tranches de 30 minutes depuis notre site.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Organiser votre cocktail dînatoire : cinq informations suffisent
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un devis juste se bâtit sur des éléments concrets, pas sur des estimations. La date
            envisagée, le nombre d'invités, l'heure de début et de fin souhaitées, le format de
            service (pièces à passer, stations fixes, éventuelles tables assises) et les contraintes
            particulières — prises de parole, régimes alimentaires, allergènes, accessibilité. Avec
            ces cinq éléments, l'équipe peut chiffrer une proposition et vous répondre concrètement.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour un petit comité, aucune démarche particulière : une table se réserve directement en
            ligne. Dès que la réception monte en effectif — à partir de 10 personnes un espace dédié
            est réservé, et la privatisation partielle prend le relais entre 50 et 150 invités — une
            demande de devis permet de valider le menu, le placement et le déroulé de la soirée.
            Vous recevez une proposition détaillée avant toute confirmation.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour situer le format dans un contexte plus large, vous pouvez consulter nos pages{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du restaurant
            </Link>
            ,{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise
            </Link>{" "}
            et{" "}
            <Link to="/repas-affaires-restaurant-paris" className="text-primary hover:underline">
              dîner d'affaires
            </Link>
            . La page{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">
              événementiel
            </Link>{" "}
            présente les différents types de réceptions accueillies, et la page{" "}
            <Link to="/restaurant" className="text-primary hover:underline">
              restaurant
            </Link>{" "}
            détaille l'établissement, ses espaces et ses horaires.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Cocktail dînatoire : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`cocktail-dinatoire-faq-${i}`} className="border-primary/15">
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
              Organisez votre cocktail aux Champs-Élysées
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Dites-nous la date, le nombre d'invités et le format : vous recevez une proposition
              chiffrée, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(COCKTAIL_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis
              </a>
              <a href={SITE.bookingPath} className="premium-button border border-primary/50 text-primary px-8 py-4">
                Réserver en ligne
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
