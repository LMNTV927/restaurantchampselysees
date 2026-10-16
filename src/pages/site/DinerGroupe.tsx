import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/detail-table.jpg";
import partage from "@/assets/site/restaurant-table.jpg";

const GROUPE_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un dîner de groupe. Date souhaitée : ... / Nombre de convives : ... / Heure d'arrivée : ... / Occasion : ... / Contraintes alimentaires (végétarien, allergies, sans porc...) : ...";

const faq = [
  {
    q: "Combien de convives peuvent dîner assis au Prince Palace ?",
    a: "La salle compte environ 250 places assises, pour une capacité totale de 500 personnes debout. Un dîner de groupe est donc possible aussi bien à douze qu'à deux cents convives, la configuration des tables étant adaptée au nombre annoncé.",
  },
  {
    q: "Peut-on réunir 20 ou 30 personnes autour d'une seule tablée ?",
    a: "Oui, en réunissant plusieurs tables sur une même ligne ou en U, selon la place disponible ce soir-là. Le plan de table est arrêté à l'avance avec l'équipe, afin que vos convives se retrouvent ensemble sans que le service en souffre.",
  },
  {
    q: "Faut-il forcément un menu unique pour le groupe ?",
    a: "Le menu unique reste le format le plus fluide : il évite les hésitations à la commande et permet de servir toute la tablée au même rythme. Un menu à deux choix par service reste possible, à condition de collecter les choix avant la soirée ; cela se décide au moment de la demande de devis.",
  },
  {
    q: "Peut-on demander des additions séparées en fin de dîner ?",
    a: "La question se pose systématiquement pour les groupes. La répartition — addition unique, partage par table ou par convive — se cale avant l'arrivée, car elle conditionne la façon dont le service enregistre les consommations pendant la soirée.",
  },
  {
    q: "Le dîner peut-il se prolonger par une soirée dansante ?",
    a: "Du jeudi au dimanche, la salle reste ouverte jusqu'à 5h et le DJ prend le relais à partir de minuit : le groupe passe du repas à la piste sans changer d'adresse. Du lundi au mercredi, la fermeture a lieu à minuit, ce qui convient aux dîners qui se terminent tôt.",
  },
  {
    q: "Comment vos invités rejoignent-ils le restaurant ?",
    a: "L'adresse est le 76 avenue des Champs-Élysées, Paris 8e, à quelques minutes des métros George V et Franklin D. Roosevelt, avec des parkings publics à proximité. Après 22h, l'entrée se fait par le 59 rue de Ponthieu, ce qui simplifie l'arrivée des derniers convives.",
  },
];

const formats = [
  {
    title: "Table d'hôte de 10 à 14 convives",
    text: "Un espace dédié est réservé à votre groupe dès dix personnes, sans que la salle entière soit mobilisée : le dîner se tient entre vous, avec la vie du lieu autour. Ce format convient aux repas d'équipe et aux retrouvailles de promotion.",
  },
  {
    title: "Tables réunies de 15 à 40 convives",
    text: "Plusieurs tables sont accolées sur une même ligne ou disposées en U, pour que le groupe se tienne visuellement et que les conversations circulent d'un bout à l'autre. Le placement se prépare à partir des noms que vous transmettez, afin que personne ne se retrouve isolé.",
  },
  {
    title: "Dîner assis de 50 à 150 convives",
    text: "La privatisation partielle consacre une partie identifiée du restaurant à votre groupe, avec ses tables, son service et son rythme, tout en laissant l'accès aux bars. C'est le format des dîners d'association et des repas de fin de trimestre.",
  },
  {
    title: "Grande réception assise jusqu'à 250 couverts",
    text: "L'ensemble du lieu est mobilisé autour d'un plan de table complet, avec des rangs alignés et un service coordonné pour que chaque table avance au même rythme. Après le dessert, la réception peut se poursuivre en soirée dansante sans changer d'adresse.",
  },
];

const reperes = [
  "Un menu court plutôt qu'un catalogue : trois entrées, deux ou trois plats, un dessert — moins de choix, une cuisine mieux tenue et un service au même rythme pour toute la tablée",
  "Des plats qui partent ensemble : sur une grande table, les assiettes arrivent simultanément par le centre et personne ne commence avant ses voisins",
  "Les régimes collectés en amont : végétarien, sans porc, sans gluten, allergènes — cette information se réunit à la réservation, jamais le soir même",
  "Une planche à partager en entrée : posée au centre, elle crée immédiatement de la conversation, là où un service individuel laisse chacun dans son coin",
  "Un rythme en deux temps : un premier service soutenu, puis une respiration avant le dessert, pour qu'un dîner de groupe ne soit pas expédié en trois quarts d'heure",
];

const creneaux = [
  "Lundi à mercredi — service de 17h à minuit : les dîners qui commencent tôt et se terminent à une heure raisonnable",
  "Jeudi à dimanche — ouverture jusqu'à 5h, avec DJ à partir de minuit : le repas se prolonge sur place quand le groupe ne veut pas s'arrêter là",
  "Créneaux de 30 minutes — l'heure d'arrivée se fixe précisément, ce qui permet d'échelonner les premiers arrivants sans retarder le service des autres",
  "Après 22h — l'entrée se fait par le 59 rue de Ponthieu : un accès commode pour les convives qui rejoignent la table en cours de soirée",
];

export default function DinerGroupe() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Dîner de groupe à Paris 8e : réunir tout le monde à la même table",
      description:
        "Dîner de groupe à Paris 8e : tables réunies de 10 à 250 convives aux Champs-Élysées, dès 17h et jusqu'à 5h. Menu de groupe, devis sur mesure.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/diner-groupe-restaurant-paris",
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
      url: "https://restaurantchampselysees.fr/diner-groupe-restaurant-paris",
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
        title="Dîner de groupe à Paris 8e : grande table Champs-Élysées"
        description="Dîner de groupe à Paris 8e : tables réunies de 10 à 250 convives aux Champs-Élysées, dès 17h et jusqu'à 5h. Menu de groupe, devis sur mesure."
        path="/diner-groupe-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Assiette dressée servie à table lors d'un dîner de groupe au Prince Palace, restaurant des Champs-Élysées à Paris 8e"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Repas de groupe</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Dîner de groupe à Paris : réunir tout le monde à la même table
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            De dix à deux cent cinquante convives assis, au 76 avenue des Champs-Élysées — un lieu
            ouvert dès 17h, et jusqu'à 5h du jeudi au dimanche.
          </p>
          <a
            href={whatsappLink(GROUPE_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Organiser notre dîner
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Réunir un groupe à table : trois problèmes à résoudre
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Dîner en groupe, c'est d'abord une affaire de place réelle. Entre ceux qui répondent
            immédiatement, ceux qui confirment la veille et l'invité qui arrive avec une personne de
            plus, il faut une salle capable d'absorber un effectif qui bouge le jour même. Avec
            environ 250 places assises pour 500 personnes debout, l'établissement encaisse ces
            ajustements sans déplacer la table.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le deuxième enjeu s'entend plutôt qu'il ne se voit : une salle trop sonore coupe un repas
            en deux. À trente personnes, les bouts de table deviennent deux groupes qui ne
            communiquent plus. La disposition — tables accolées sur une ligne ou en U — sert
            précisément à garder la tablée lisible plutôt qu'à empiler les couverts.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Reste la mécanique la plus prosaïque : le moment où les plats arrivent, et la manière de
            servir une tablée entière sans que la moitié attende pendant que l'autre a terminé.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            De 10 à 250 convives : comment on assemble les tables
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Le format dépend du nombre, puis de l'ambiance recherchée — dîner d'équipe détendu ou
            repas de représentation.
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
            Un menu de groupe qui ne ressemble pas à une cantine
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            La difficulté d'un repas de groupe n'est pas la quantité, mais la simultanéité : faire
            arriver cent assiettes chaudes ensemble suppose un menu pensé pour cela. Un menu
            resserré, bâti sur des cuissons qui supportent quelques minutes d'attente, donne un
            résultat très supérieur à une longue carte.
          </p>
          <ul className="space-y-3 mb-8">
            {reperes.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le menu unique annoncé à l'avance reste le plus efficace : plus personne ne tergiverse à
            la commande et l'addition se calcule sans ambiguïté. Un service à deux choix — viande,
            poisson ou alternative végétarienne — fonctionne aussi, si les choix sont collectés à
            l'avance.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Dernier point, souvent oublié : les boissons. Un groupe qui trinque au même moment
            démarre mieux qu'un groupe servi verre par verre — vin de table, cocktail d'accueil ou
            formule à volonté se calent en même temps que le menu.
          </p>
          <img
            src={partage}
            alt="Planche à partager posée au centre de la table pour un dîner de groupe aux Champs-Élysées"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            À quelle heure dîner en groupe ? Le créneau dessine la soirée
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un repas de groupe ne dure pas deux heures : comptez deux heures trente à trois heures
            entre l'arrivée et le dessert, davantage si les convives se connaissent peu.
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
            Un groupe qui envisage de danser n'a rien de plus à organiser : du jeudi au dimanche, la
            salle bascule en ambiance club une fois minuit passé, sans chercher un second lieu. En
            début de semaine, le repas se termine plus tôt — ce que beaucoup d'équipes recherchent.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce qu'il nous faut savoir pour chiffrer votre dîner
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Quatre éléments suffisent à établir une proposition réaliste : le nombre de convives,
            même approximatif, la date et le créneau envisagés, la nature de l'occasion et les
            contraintes alimentaires du groupe. L'équipe revient alors avec un menu, un prix par
            personne et une disposition de table.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour un petit groupe, il n'y a rien à préparer : une table se réserve directement en
            ligne, par créneaux de 30 minutes. À partir de dix personnes, un espace dédié vous est
            attribué, et la privatisation partielle prend le relais au-delà de cinquante convives.
            L'organisation se fait alors avec un interlocuteur unique, joignable au{" "}
            <a href={SITE.phoneHref} className="text-primary hover:underline">
              {SITE.phone}
            </a>
            .
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Selon l'occasion, ces pages vous seront utiles : la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du lieu
            </Link>
            , les{" "}
            <Link to="/anniversaire-restaurant-paris" className="text-primary hover:underline">
              anniversaires fêtés au restaurant
            </Link>{" "}
            et les{" "}
            <Link to="/cocktail-dinatoire-paris" className="text-primary hover:underline">
              réceptions debout
            </Link>{" "}
            détaillent d'autres formats de réception. La page{" "}
            <Link to="/restaurant" className="text-primary hover:underline">
              présentation du restaurant
            </Link>{" "}
            précise les espaces et les horaires, et le{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">
              volet événementiel
            </Link>{" "}
            recense les types de réceptions accueillies ici même.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Dîner de groupe : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`diner-groupe-faq-${i}`} className="border-primary/15">
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
              Votre dîner de groupe aux Champs-Élysées
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Indiquez-nous la date, le nombre de convives et l'occasion : vous recevez une
              proposition chiffrée, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(GROUPE_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis groupe
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
