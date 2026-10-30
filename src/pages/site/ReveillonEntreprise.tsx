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
import hero from "@/assets/site/vibe-1.jpg";
import table from "@/assets/site/privatisation.jpg";

const REVEILLON_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser le réveillon de mon entreprise. Date souhaitée : 31 décembre / Nombre de personnes : ... / Formule (dîner, privatisation partielle, privatisation totale) : ...";

const faq = [
  {
    q: "Quand réserver le réveillon d'entreprise au Prince Palace ?",
    a: "Le 31 décembre affiche très vite complet : nous recommandons de réserver dès le mois d'octobre ou novembre pour garantir l'espace souhaité et le format de soirée choisi.",
  },
  {
    q: "Quelle formule pour un réveillon d'entreprise ?",
    a: "Un espace dédié dans la salle pour les équipes à partir de 10 personnes, une privatisation partielle de 50 à 150 invités, ou une privatisation totale jusqu'à 500 invités pour une entreprise qui veut le lieu pour elle seule.",
  },
  {
    q: "Le réveillon se termine-t-il en soirée dansante ?",
    a: "Oui. Du jeudi au dimanche, le Prince Palace bascule en ambiance club avec DJ à partir de minuit, ce qui correspond au passage naturel du dîner à la fête pour le réveillon.",
  },
  {
    q: "Comment obtenir un devis pour le réveillon d'entreprise ?",
    a: "Envoyez-nous par WhatsApp le nombre de collaborateurs attendus et la formule souhaitée (dîner, privatisation partielle ou totale). L'équipe revient avec une proposition détaillée avant toute confirmation.",
  },
  {
    q: "Comment accède-t-on au Prince Palace après 22h ?",
    a: "À partir de 22h, l'entrée se fait par le 59 rue de Ponthieu plutôt que par le 76 avenue des Champs-Élysées, pour fluidifier l'arrivée des invités en soirée.",
  },
  {
    q: "Peut-on organiser un dîner puis des discours avant la soirée ?",
    a: "Oui, c'est l'organisation la plus fréquente pour un réveillon d'entreprise : dîner assis avec discours ou bilan de l'année, puis ouverture de la piste pour la suite de la soirée.",
  },
];

const formules = [
  {
    title: "Espace dédié (10 à 50 invités)",
    text: "Une partie de la salle réservée à l'entreprise pour un dîner de réveillon, au milieu de l'ambiance générale du restaurant — idéal pour une petite équipe qui veut profiter de l'atmosphère de fête sans mobiliser tout un espace.",
  },
  {
    title: "Privatisation partielle (50 à 150 invités)",
    text: "Un espace fermé pour l'entreprise seule, avec son propre service, sa propre ambiance et un déroulé défini avec vous, sans partager la salle avec d'autres groupes ni d'autres clients du restaurant.",
  },
  {
    title: "Privatisation totale (jusqu'à 500 invités)",
    text: "Le Prince Palace entier pour l'entreprise : accueil, dîner, discours, DJ et piste de danse sans aucun invité extérieur — la formule des grandes structures qui réunissent plusieurs services ou filiales le même soir.",
  },
];

const reperes = [
  "Dîner de réveillon suivi d'une ouverture de piste avec DJ",
  "Capacité jusqu'à 500 invités en configuration cocktail, environ 250 en dîner assis",
  "Du jeudi au dimanche, ambiance club avec DJ à partir de minuit",
  "Accès par le 59 rue de Ponthieu après 22h",
  "Menu de groupe adapté avec options végétariennes",
];

export default function ReveillonEntreprise() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Réveillon d'entreprise à Paris : soirée de fin d'année aux Champs-Élysées",
      description:
        "Organiser le réveillon d'entreprise à Paris : dîner de fête, privatisation partielle ou totale, soirée dansante dès minuit, jusqu'à 500 invités aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/reveillon-entreprise-paris",
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
        title="Réveillon d'entreprise à Paris | Prince Palace"
        description="Réveillon d'entreprise à Paris : dîner, privatisation et soirée dansante, jusqu'à 500 invités aux Champs-Élysées. Devis sur mesure."
        path="/reveillon-entreprise-paris"
        jsonLd={jsonLd}
      />

      <HeroSection image={hero} alt="Cocktail de fête servi pour un réveillon d'entreprise aux Champs-Élysées" priority>
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Réveillon d'entreprise
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Réveillon d'entreprise à Paris
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Dîner de fête, discours de fin d'année puis soirée dansante : réunissez vos équipes
            pour le réveillon au Prince Palace, de 10 à 500 invités aux Champs-Élysées.
          </p>
          <a
            href={whatsappLink(REVEILLON_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Demander un devis réveillon
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Le 31 décembre se réserve tôt</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le réveillon d'entreprise est, avec les fêtes de fin d'année, la soirée la plus demandée
            de l'agenda du Prince Palace. Les créneaux pour le 31 décembre partent plusieurs semaines
            avant la date, en particulier pour les formules de privatisation. Une entreprise qui
            souhaite réunir ses équipes ce soir précis a donc intérêt à fixer la date et le nombre
            d'invités dès octobre ou novembre, plutôt qu'à la mi-décembre, au moment où les derniers
            créneaux de privatisation partielle et totale ont déjà trouvé preneur.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            L'adresse, au 76 avenue des Champs-Élysées, facilite l'arrivée d'invités venant de
            toute la région parisienne : accès par les métros George V et Franklin D. Roosevelt,
            parkings publics à proximité, et entrée dédiée par le 59 rue de Ponthieu à partir de
            22h pour fluidifier le flux en soirée. Pour un comité d'organisation, cette double
            entrée simplifie aussi l'accueil : les premiers invités peuvent arriver pour le dîner
            par l'avenue, pendant que le flux de fin de soirée, plus dense, se canalise par la rue
            de Ponthieu sans créer d'attente.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Contrairement à une salle de réception classique louée pour une seule soirée, le
            Prince Palace reste un restaurant en activité toute l'année : l'équipe connaît déjà les
            usages d'un service de groupe, la logistique d'un vestiaire chargé et le rythme d'une
            salle qui bascule du dîner à la piste de danse. Pour un comité d'entreprise qui organise
            son réveillon sans expérience événementielle, cette habitude réduit nettement le risque
            d'imprévu le soir même.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Trois formules selon la taille de l'équipe</h2>
          <div className="space-y-8">
            {formules.map((f) => (
              <div key={f.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <img
            src={table}
            alt="Assiettes dressées pour un réveillon d'entreprise privatisé aux Champs-Élysées"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mb-8"
          />
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Du dîner de fête à la piste de danse</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le déroulé le plus demandé commence par un dîner assis : bilan de l'année, remerciements
            ou discours de direction, puis service d'un menu de fête. Le format restaurant-club du
            Prince Palace permet ensuite d'enchaîner sans déplacer les invités : du jeudi au
            dimanche, l'ambiance bascule en club avec DJ à partir de minuit, au moment précis où un
            réveillon a besoin de changer de rythme.
          </p>
          <ul className="space-y-3 mb-8">
            {reperes.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Pour une entreprise qui veut garder le lieu pour elle seule, la privatisation totale
            ouvre les 500 places du Prince Palace sans aucun invité extérieur. Voir aussi nos pages{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation de restaurant à Paris
            </Link>{" "}
            et{" "}
            <Link to="/soiree-dansante-paris" className="text-primary hover:underline">
              soirée dansante à Paris
            </Link>
            .
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Organiser le réveillon avec votre entreprise</h2>
          <p className="text-muted-foreground leading-relaxed">
            Indiquez-nous par WhatsApp le nombre de collaborateurs attendus et la formule souhaitée
            (espace dédié, privatisation partielle ou totale). L'équipe revient avec une proposition
            détaillée — plan de salle, menu de fête, créneau d'arrivée — avant toute confirmation.
            Pour une petite équipe de moins de 10 personnes, la réservation en ligne par créneaux de
            30 minutes suffit, tél. {SITE.phone}.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Ce qui distingue un réveillon d'entreprise réussi</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Les entreprises qui organisent leur réveillon au Prince Palace reviennent souvent sur
            trois points précis. D'abord, le menu : contrairement à un dîner d'affaires classique,
            le réveillon appelle une carte plus festive, pensée pour marquer l'occasion sans alourdir
            le service — un menu de groupe adapté, avec options végétariennes, est défini en amont
            avec le comité d'organisation. Ensuite, le timing : un réveillon mal cadencé perd
            l'énergie de la salle entre la fin du dîner et le début de la soirée dansante ; au
            Prince Palace, la bascule se fait sans rupture, le DJ prenant le relais pendant que le
            service dessert les tables. Enfin, l'accueil : pour une entreprise de plus de 50
            personnes, un point d'accueil dédié avec vestiaire et liste d'invités évite les
            attentes à l'entrée au moment le plus chargé de la soirée.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Un dernier repère utile pour les comités d'organisation : prévoir une marge de 10 à 15%
            sur le nombre d'invités confirmés. Entre les accompagnants de dernière minute et les
            désistements, cette marge permet d'ajuster le plan de salle sans renégocier la formule
            la semaine précédant le 31 décembre.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Comparer avec une salle de réception louée</h2>
          <p className="text-muted-foreground leading-relaxed">
            Beaucoup de comités d'entreprise commencent leur recherche par une salle de réception
            classique, louée vide pour la soirée, avant de comparer avec un restaurant-club déjà
            équipé. La différence se voit surtout sur deux points : le traiteur et l'ambiance
            sonore. Louer une salle vide implique de coordonner traiteur, DJ, éclairage et service
            avec des prestataires séparés, et de gérer les aléas de chacun le soir même. Au Prince
            Palace, la cuisine, le service et la régie son font partie du même lieu, avec une
            équipe qui enchaîne dîner et soirée depuis plusieurs années — ce qui simplifie la
            coordination pour un comité d'organisation qui n'a pas de budget dédié à un régisseur
            événementiel.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Réveillon d'entreprise : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`reveillon-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Réservez le réveillon de votre entreprise</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Obtenez une proposition sur mesure pour le 31 décembre, avant que les dernières dates ne partent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(REVEILLON_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis
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
