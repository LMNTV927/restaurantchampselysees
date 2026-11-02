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
import hero from "@/assets/site/vibe-3.jpg";
import table from "@/assets/site/restaurant-table.jpg";

const TARD_MESSAGE =
  "Bonjour Prince Palace, je souhaite réserver une table en fin de soirée. Date souhaitée : ... / Heure d'arrivée envisagée : ... / Nombre de personnes : ...";

const horaires = [
  "Réservation en ligne par créneaux de 30 minutes, de 17h à 5h",
  "Lundi, mardi, mercredi : service jusqu'à minuit",
  "Jeudi à dimanche : service jusqu'à 5h du matin, DJ à partir de minuit",
  "Après 22h, l'entrée se fait par le 59 rue de Ponthieu plutôt que par l'avenue",
  "Métros George V et Franklin D. Roosevelt accessibles jusqu'en fin de service",
];

const profils = [
  {
    title: "Après un spectacle ou un concert",
    text: "Les salles des Champs-Élysées et des Grands Boulevards libèrent leur public entre 22h30 et 23h30 : trop tard pour la plupart des cuisines parisiennes, pas pour la nôtre, qui sert encore un dîner complet à cette heure.",
  },
  {
    title: "Après un vol ou une arrivée tardive",
    text: "Un atterrissage en soirée, un décalage horaire qui laisse l'appétit à contretemps : la salle reste ouverte sans qu'il faille se contenter d'un room service.",
  },
  {
    title: "Pour les habitués de la nuit parisienne",
    text: "Certains dînent simplement tard par goût, loin de l'affluence du service de 20h. La table est aussi calme à minuit qu'à 19h, avant que l'ambiance ne change du jeudi au dimanche.",
  },
];

const faq = [
  {
    q: "Peut-on vraiment commander un dîner complet après minuit ?",
    a: "Oui, du jeudi au dimanche la cuisine reste ouverte jusqu'à la fermeture à 5h. Les lundi, mardi et mercredi, le service s'arrête à minuit : mieux vaut réserver un créneau avant cette heure ces soirs-là.",
  },
  {
    q: "Faut-il réserver pour un dîner à une heure tardive ?",
    a: "La réservation en ligne se fait par créneaux de 30 minutes jusqu'à la fermeture. Elle n'est pas obligatoire mais garantit une table disponible, surtout du jeudi au dimanche quand l'ambiance club commence à attirer du monde.",
  },
  {
    q: "Comment entrer dans le restaurant après 22h ?",
    a: "L'entrée principale, au 76 avenue des Champs-Élysées, reste accessible, mais à partir de 22h l'accès se fait par le 59 rue de Ponthieu. Indiquez-le à vos invités s'ils arrivent en plusieurs fois.",
  },
  {
    q: "L'ambiance est-elle la même à minuit qu'à 19h ?",
    a: "Non. En début de soirée, la salle garde un rythme de restaurant classique. Du jeudi au dimanche, le DJ prend le relais à partir de minuit et l'ambiance devient plus festive, sans que le service en salle s'arrête pour ceux qui dînent encore.",
  },
  {
    q: "Peut-on venir seul ou en couple pour un dîner tardif ?",
    a: "Oui, une table pour une ou deux personnes se réserve comme n'importe quelle autre, par le même système de créneaux. Le dîner tardif n'est pas réservé aux groupes.",
  },
];

export default function RestaurantOuvertTard() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Restaurant ouvert jusqu'à 5h du matin aux Champs-Élysées : dîner tardif à Paris",
      description:
        "Un restaurant ouvert tard à Paris, jusqu'à 5h du jeudi au dimanche : horaires réels, accès après 22h et réservation par créneaux aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/restaurant-ouvert-tard-paris",
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
        title="Restaurant ouvert tard à Paris : dîner jusqu'à 5h"
        description="Un restaurant ouvert tard à Paris, jusqu'à 5h du jeudi au dimanche : horaires réels, accès après 22h et réservation par créneaux aux Champs-Élysées."
        path="/restaurant-ouvert-tard-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Cocktail servi tard dans la soirée au restaurant Prince Palace, Champs-Élysées, Paris 8e"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Guide pratique
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Un restaurant ouvert jusqu'à 5h du matin aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Pas un bar de nuit qui propose un plat en dépannage : une vraie cuisine, servie à table,
            tant que la salle reste ouverte. Voici ce que cela change concrètement, jour par jour.
          </p>
          <a
            href={whatsappLink(TARD_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Réserver un dîner tardif
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Pourquoi chercher un restaurant ouvert aussi tard
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            À Paris, la plupart des cuisines ferment entre 22h30 et 23h, même dans les quartiers
            animés. Pour qui sort d'un spectacle, atterrit en soirée ou préfère simplement dîner
            loin de l'affluence, l'offre se réduit vite à un sandwich ou un fast-food ouvert
            toute la nuit.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Le Prince Palace répond à ce créneau autrement : un restaurant-club où la cuisine
            continue de servir tant que la salle est ouverte, et où l'ambiance évolue avec l'heure
            plutôt que de s'arrêter net.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Les horaires réels, jour par jour
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            La durée du service dépend du jour de la semaine. Mieux vaut le savoir avant de fixer
            une heure d'arrivée tardive.
          </p>
          <ul className="space-y-3 mb-8">
            {horaires.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {h}
              </li>
            ))}
          </ul>
          <img
            src={table}
            alt="Planche à partager servie tard le soir au restaurant Prince Palace, Paris 8e"
            width={1600}
            height={1072}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            À quoi ressemble un dîner à une heure tardive
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            En début de soirée, la salle garde un rythme de restaurant classique : tables servies,
            discussions, service posé. Du jeudi au dimanche, à partir de minuit, le DJ prend le
            relais et l'ambiance monte d'un cran — sans que les tables qui dînent encore soient
            pressées de laisser la place.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Les lundis, mardis et mercredis, la soirée reste plus feutrée toute la nuit, avec une
            fermeture à minuit : le dîner tardif y ressemble davantage à un dîner classique qui a
            simplement commencé plus tard.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Qui vient dîner si tard</h2>
          <div className="space-y-8">
            {profils.map((p) => (
              <div key={p.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce qui distingue un dîner tardif d'un simple en-cas de nuit
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La différence tient à la cuisine elle-même. Beaucoup d'adresses ouvertes après minuit
            à Paris proposent une carte réduite, pensée pour aller vite plutôt que pour nourrir
            une vraie soirée : un plat unique, une planche standard, quelques boissons. Au Prince
            Palace, la carte servie à minuit reste la même qu'à 19h — assiettes à partager, plats
            signature, sélection de vins et de champagnes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Ce choix a un coût en organisation : la cuisine et le service tournent sur une
            amplitude large, du jeudi au dimanche, ce qui suppose une équipe présente toute la
            nuit plutôt qu'un service allégé. C'est précisément ce qui permet à une table de deux
            ou à un petit groupe de dîner correctement à 1h du matin, sans se contenter d'un
            dépannage.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Réserver et trouver l'entrée au bon moment
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La réservation se fait en ligne par créneaux de 30 minutes, jusqu'à la fermeture du
            soir. Elle garantit une table, ce qui compte surtout du jeudi au dimanche, quand
            l'ambiance club commence à remplir la salle en parallèle du service à table.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un détail à connaître avant de fixer un rendez-vous tard : à partir de 22h, l'accès ne
            se fait plus par le 76 avenue des Champs-Élysées mais par le 59 rue de Ponthieu, à
            quelques pas. Prévenez vos invités s'ils arrivent séparément.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour un dîner à plusieurs qui démarre après 22h, le{" "}
            <Link to="/restaurant" className="text-primary hover:underline">
              restaurant
            </Link>{" "}
            reçoit aussi bien une table de deux qu'un groupe. Si la soirée est amenée à se
            prolonger vers une ambiance plus festive, voyez la page{" "}
            <Link to="/afterwork-paris-champs-elysees" className="text-primary hover:underline">
              afterwork
            </Link>
            , et pour un dîner qui doit déboucher sur une piste de danse, la{" "}
            <Link to="/soiree-dansante-paris" className="text-primary hover:underline">
              soirée dansante
            </Link>{" "}
            détaille la bascule entre les deux. Le lieu se trouve au 76 avenue des
            Champs-Élysées et au 59 rue de Ponthieu, Paris 8e, à quelques minutes des métros
            George V et Franklin D. Roosevelt.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Dîner tardif : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`tard-faq-${i}`} className="border-primary/15">
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
              Réservez votre table, même tard dans la nuit
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Indiquez la date, l'heure d'arrivée et le nombre de personnes : la table est prête,
              quel que soit le moment de la soirée.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Réserver une table
              </a>
              <a
                href={whatsappLink(TARD_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button border border-primary/50 text-primary px-8 py-4"
              >
                Demander un créneau tardif
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
