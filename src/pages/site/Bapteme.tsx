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
import table from "@/assets/site/detail-table.jpg";

const BAPTEME_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un dîner de baptême. Date souhaitée : ... / Nombre d'invités : ... / Espace dédié ou privatisation : ...";

const formats = [
  {
    title: "Autour d'une seule table",
    text: "Pour les parrains, la marraine et une dizaine de proches, une table dressée suffit : pas de minimum de couverts, pas de formulaire à remplir en amont.",
  },
  {
    title: "Un coin réservé pour la famille",
    text: "Dès 10 convives, un coin de salle peut être mis à part pour le groupe, tout en laissant le reste du service du soir continuer tout autour.",
  },
  {
    title: "Une partie du restaurant pour vous",
    text: "De 50 à 150 invités, une privatisation partielle libère de l'espace pour le discours des parrains et le gâteau, sans transformer la soirée en organisation lourde.",
  },
];

const reperes = [
  "Groupes reçus à partir de 17h seulement : aucune formule de déjeuner de baptême",
  "Coin réservé dès 10 convives, sans démarche de privatisation à engager",
  "De 50 à 150 invités en privatisation partielle, jusqu'à 500 en totale",
  "Bascule en club avec DJ passé minuit, uniquement du jeudi au dimanche",
  "En début de semaine (lundi-mercredi), la salle ferme à minuit sans changement d'ambiance",
];

const faq = [
  {
    q: "Peut-on organiser le baptême en journée, après la cérémonie ?",
    a: "Le service de groupe commence à 17h, sans exception. Le dîner de baptême se tient donc en soirée, après la cérémonie et les éventuelles festivités de l'après-midi organisées ailleurs.",
  },
  {
    q: "Combien d'invités peut-on réunir pour un dîner de baptême ?",
    a: "D'une table d'une dizaine de proches à un groupe de 150 en privatisation partielle, et jusqu'à 500 en privatisation totale. Le format se choisit selon le nombre réel d'invités.",
  },
  {
    q: "Peut-on prévoir un discours des parrains ou un gâteau personnalisé ?",
    a: "Oui, à condition de le signaler à la réservation. L'équipe prépare le timing du service en conséquence, surtout pour un espace dédié ou une privatisation où plusieurs temps forts s'enchaînent.",
  },
  {
    q: "Le dîner convient-il à un baptême avec des enfants ?",
    a: "Oui, pour un dîner familial calme, mieux vaut viser le début de soirée du lundi au mercredi, quand la salle ferme à minuit sans bascule en ambiance club.",
  },
  {
    q: "Le dîner de baptême peut-il se prolonger en soirée dansante ?",
    a: "Du jeudi au dimanche, oui : à partir de minuit, le DJ prend le relais et la salle bascule en ambiance club. Les proches qui le souhaitent peuvent enchaîner sans changer d'adresse.",
  },
];

export default function Bapteme() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Dîner de baptême à Paris : fêter en famille au restaurant",
      description:
        "Organiser un dîner de baptême à Paris en famille : formats selon le nombre d'invités, horaires du soir, option privatisation aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/bapteme-restaurant-paris",
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
        title="Dîner de baptême à Paris : fêter en famille au restaurant"
        description="Organiser un dîner de baptême à Paris en famille : formats selon le nombre d'invités, horaires du soir, option privatisation aux Champs-Élysées."
        path="/bapteme-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Table dressée pour un dîner de baptême en famille au restaurant Prince Palace, Champs-Élysées"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Guide pratique
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Dîner de baptême à Paris : fêter en famille au restaurant
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Pas une salle de réception avec prestataires imposés : un dîner en soirée pour
            prolonger la fête du baptême entre parrains, marraine et proches, servi à table.
          </p>
          <a
            href={whatsappLink(BAPTEME_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander un devis baptême
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Pourquoi un restaurant pour fêter un baptême
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Après la cérémonie, beaucoup de familles cherchent un lieu simple pour prolonger la
            journée sans organiser une salle de réception complète : pas de traiteur à coordonner,
            pas de décoration à monter soi-même, juste une table dressée et un service qui
            s'occupe du reste.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Au Prince Palace, ce dîner suit le même traitement que tout autre événement privé :
            menu arrêté en amont avec l'équipe, service dédié au groupe, et une salle capable,
            certains soirs, de continuer bien après le café.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois formats selon le nombre d'invités
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un dîner de baptême réunit rarement plus de quelques dizaines de proches. Le format se
            choisit selon ce nombre, pas l'inverse.
          </p>
          <div className="space-y-8">
            {formats.map((f) => (
              <div key={f.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
          <img
            src={table}
            alt="Assiette dressée pour un dîner de baptême, restaurant Prince Palace Paris"
            width={1200}
            height={1500}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mt-8"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce qu'il faut savoir avant de réserver
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Quelques repères permettent de choisir le bon soir sans tâtonner.
          </p>
          <ul className="space-y-3 mb-8">
            {reperes.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Un repère de famille qui peut s'étirer en soirée
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Rien n'oblige à écourter la fête après le café. Du jeudi au dimanche, le DJ prend le
            relais passé minuit et l'ambiance glisse en mode club : ceux qui veulent danser
            restent sur place, sans qu'il faille réorganiser un départ ou un second transport pour
            les invités en fin de soirée.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            En début de semaine, l'ambiance reste volontairement plus calme jusqu'à la fermeture à
            minuit — un choix souvent préféré quand des enfants font partie des invités du baptême.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Organiser le discours des parrains et le gâteau
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Rien de complexe à prévoir : il suffit de signaler à l'avance ce qui rythmera la
            soirée. Un discours des parrains à caler dans le service, une bouteille à ouvrir à un
            instant précis, un gâteau apporté de l'extérieur plutôt que commandé sur place —
            chaque détail annoncé en amont permet à l'équipe d'ajuster le rythme du service, en
            particulier dans un coin réservé ou une privatisation partielle où les temps forts
            s'enchaînent.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Au-delà de 150 proches, seule une{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation totale
            </Link>{" "}
            offre assez d'espace pour enchaîner dîner, discours et piste de danse sans partager la
            salle avec d'autres clients, jusqu'à 500 personnes. Le lieu se trouve au 76 avenue des
            Champs-Élysées, avec un second accès au 59 rue de Ponthieu, Paris 8e, à deux pas des
            métros George V et Franklin D. Roosevelt.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Baptême ou autre célébration familiale ?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le même principe vaut pour d'autres fêtes de famille : un{" "}
            <Link to="/mariage-petit-comite-paris" className="text-primary hover:underline">
              mariage en petit comité
            </Link>{" "}
            ou des fiançailles se reçoivent selon la même logique, avec un espace calibré sur le
            nombre réel d'invités plutôt que sur une salle surdimensionnée.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Si le baptême coïncide avec un{" "}
            <Link to="/anniversaire-restaurant-paris" className="text-primary hover:underline">
              anniversaire
            </Link>{" "}
            d'un grand-parent ou d'un aîné de la famille, les deux événements se fêtent sans
            difficulté sur la même table ou dans le même espace réservé.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Dîner de baptême : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`bapteme-faq-${i}`} className="border-primary/15">
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
              Organisons le dîner de votre baptême
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Précisez la date du baptême, le nombre de convives et le format souhaité : nous
              revenons vers vous avec une proposition sur-mesure.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Réserver une table
              </a>
              <a
                href={whatsappLink(BAPTEME_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button border border-primary/50 text-primary px-8 py-4"
              >
                Demander un devis baptême
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
