import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/event-soiree.jpg";
import assiettes from "@/assets/site/privatisation.jpg";

const LANCEMENT_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un lancement de produit. Date souhaitée : ... / Nombre d'invités : ... / Format (debout ou assis) : ... / Heure de la prise de parole : ... / Besoins techniques : ...";

const faq = [
  {
    q: "Peut-on organiser un lancement de produit en début de semaine ?",
    a: "Oui. Du lundi au mercredi, l'établissement accueille les groupes dès 17h et ferme à minuit : la soirée tient dans une plage de sept heures, ce qui suffit largement à une révélation suivie d'un cocktail. Du jeudi au dimanche, la salle reste ouverte jusqu'à 5h et le DJ démarre à minuit pour les invités qui prolongent.",
  },
  {
    q: "Combien d'invités peut-on convier à une soirée de lancement ?",
    a: "La capacité est de 500 personnes debout et d'environ 250 convives assis. Un lancement presse réunit souvent entre 40 et 150 invités, ce qui laisse de la marge : la zone réservée peut être dimensionnée sur l'effectif confirmé plutôt que sur la liste d'invitations initiale.",
  },
  {
    q: "Faut-il privatiser tout le restaurant pour un lancement ?",
    a: "Pas nécessairement. Un espace dédié est attribué dès dix personnes pour un dîner ou une prise de parole en petit comité ; la privatisation partielle convient de 50 à 150 invités ; la privatisation totale mobilise l'ensemble du lieu jusqu'à 500 personnes. Le choix dépend surtout du niveau de confidentialité souhaité autour du produit.",
  },
  {
    q: "Peut-on installer un décor, un présentoir ou un mur de photos ?",
    a: "L'aménagement se prépare en amont avec l'équipe : disposition du mobilier, emplacement du produit et circulation des invités se calent lors du devis, en tenant compte de l'espace réellement réservé. Les contraintes techniques — alimentation électrique, accrochage, arrivée des prestataires — doivent être signalées à ce moment-là, pas le soir même.",
  },
  {
    q: "Comment les invités accèdent-ils au lieu en soirée ?",
    a: "L'adresse principale est le 76 avenue des Champs-Élysées, à Paris 8e, à quelques minutes des métros George V et Franklin D. Roosevelt, avec des parkings publics à proximité. À partir de 22h, l'entrée se fait par le 59 rue de Ponthieu : cette information mérite de figurer sur le carton d'invitation pour les retardataires.",
  },
  {
    q: "La soirée peut-elle continuer après la révélation du produit ?",
    a: "C'est même le cas le plus fréquent : la révélation lance la partie conviviale, qui se poursuit autour d'un cocktail dînatoire debout. Du jeudi au dimanche, la salle bascule en ambiance club avec DJ à partir de minuit, ce qui évite aux invités de chercher une seconde adresse dans la nuit.",
  },
];

const deroule = [
  "17h00 — ouverture et accueil des premières équipes : le produit reste invisible, le bar démarre",
  "18h00 — arrivée de la presse et des invités, échanges debout dans la zone réservée",
  "18h45 — prise de parole courte : dix à quinze minutes, un discours long dilue l'attention avant la révélation",
  "19h00 — révélation, placée quand la salle est pleine mais pas encore dispersée",
  "19h30 — service debout, pièces à passer et stations, pour garder une main libre",
  "21h30 — interviews, démonstrations et photos avec le produit, pendant que le service ralentit",
];

const formats = [
  {
    title: "Présentation restreinte, de 20 à 50 personnes",
    text: "Un espace dédié est réservé dès dix personnes, avec tables et assises : le format convient aux journalistes, aux distributeurs ou à un cercle d'investisseurs. La parole y est plus longue et le produit circule de main en main plutôt que d'être présenté à distance.",
  },
  {
    title: "Soirée de lancement debout, de 50 à 150 invités",
    text: "La privatisation partielle consacre une partie identifiée du restaurant à l'événement, avec son flux d'invités, tout en gardant l'accès aux bars. Assez de monde pour créer du bruit autour du produit, assez d'espace pour que chacun voie la révélation.",
  },
  {
    title: "Lancement-événement, jusqu'à 500 invités",
    text: "L'ensemble du lieu est mobilisé, avec un parcours d'arrivée, une zone de révélation et une zone de cocktail distinctes. Ce format suppose une organisation plus lourde — liste d'invités, accueil, vestiaire — et se cale plusieurs semaines avant la date.",
  },
];

const reperes = [
  "L'heure de la révélation : elle fixe l'heure d'ouverture, le rythme du service et la durée de parole qui la précède",
  "L'écart entre invitations envoyées et présences réelles : une zone réservée un peu plus large évite l'engorgement devant le produit",
  "La place du produit dans l'espace : un présentoir visible depuis l'entrée vaut mieux qu'un pupitre au fond de la salle",
  "Le format du service : debout pour multiplier les rencontres, assis pour une présentation suivie d'un dîner",
  "La captation : photographe et vidéaste ont besoin d'un point de vue dégagé sur la révélation, décidé avant l'installation du public",
];

export default function LancementProduit() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Lancement de produit à Paris : la soirée où le produit se révèle",
      description:
        "Organiser un lancement de produit à Paris 8e : jusqu'à 500 invités debout aux Champs-Élysées, dès 17h, cocktail et DJ jusqu'à 5h. Devis sur mesure.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/lancement-produit-restaurant-paris",
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
      url: "https://restaurantchampselysees.fr/lancement-produit-restaurant-paris",
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
        title="Lancement de produit à Paris 8e : soirée de révélation"
        description="Organiser un lancement de produit à Paris 8e : jusqu'à 500 invités debout aux Champs-Élysées, dès 17h, cocktail et DJ jusqu'à 5h. Devis sur mesure."
        path="/lancement-produit-restaurant-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Verre signature tenu à la main pendant une soirée de lancement de produit aux Champs-Élysées, Paris 8e"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Événement presse</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Lancement de produit à Paris : la soirée où le produit se révèle
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Un lieu ouvert au 76 avenue des Champs-Élysées, 500 invités debout possibles, et une
            salle qui accueille le cocktail comme la suite de la nuit.
          </p>
          <a
            href={whatsappLink(LANCEMENT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
          >
            Organiser notre lancement
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Tout se joue sur un instant, et tout le reste le prépare
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un lancement de produit tient à une minute : celle où le produit apparaît. Autour de ce
            moment, chaque décision compte — l'heure d'arrivée des invités, la distance entre la
            première rangée et le produit, le bruit de fond au moment du discours.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le deuxième piège est arithmétique. Entre les invitations envoyées, les réponses
            positives et les présences réelles, l'écart se compte souvent en dizaines de personnes.
            Une salle d'environ 250 places assises, jusqu'à 500 debout, absorbe cet écart sans
            laisser un espace vide au milieu de la révélation.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Reste l'après : un produit dévoilé à 19h laisse trois à quatre heures de conversations à
            organiser. Choisir un lieu où la deuxième partie se tient sans déplacement règle la
            moitié de la logistique — personne à réorienter vers un bar voisin.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            L'adresse fait partie du dispositif
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un lancement produit vit aussi par ce qui circule ensuite : articles, stories, photos
            partagées. Une soirée avenue des Champs-Élysées situe l'événement dans une géographie que
            tout le monde connaît, et l'adresse s'inscrit d'elle-même dans les légendes des
            publications.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Les invités arrivent par le 76 avenue des Champs-Élysées, près des métros George V et
            Franklin D. Roosevelt, avec des parkings publics à proximité. À partir de 22h, l'accès
            bascule au 59 rue de Ponthieu : à indiquer sur l'invitation, sous peine de voir les
            derniers arrivants chercher une porte close. Cette double entrée sert aussi les
            prestataires, qui montent le matériel par la rue pendant que l'accueil reste sur les
            Champs-Élysées.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Le déroulé d'une soirée de lancement, de l'ouverture à la dernière coupe
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un ordre de grandeur plutôt qu'un modèle à suivre à la lettre : le service démarre à 17h
            et la réservation fonctionne par créneaux de 30 minutes, ce qui permet de fixer une heure
            d'arrivée précise plutôt qu'une fourchette.
          </p>
          <ul className="space-y-3 mb-8">
            {deroule.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois formats, selon qui vous conviez
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Le format se choisit selon l'audience avant de se choisir selon le budget : une presse
            spécialisée et un parterre de distributeurs n'attendent pas la même chose.
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
            Cinq décisions à trancher avant de bloquer la date
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            La plupart des lancements ratés ne le sont pas pour une raison technique, mais parce
            qu'une de ces cinq questions a été tranchée tard, une fois les invitations parties.
          </p>
          <ul className="space-y-3 mb-8">
            {reperes.map((c) => (
              <li key={c} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
          <img
            src={assiettes}
            alt="Assiettes individuelles dressées pour le service d'un cocktail de lancement de produit à Paris 8e"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce que le lieu assure, ce que vous apportez
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La salle, le mobilier, le service et les boissons relèvent de l'établissement, et se
            règlent dans le même devis que le menu. Pour un lancement, la formule debout reste la plus
            adaptée : elle laisse une main libre aux invités qui tiennent le produit, leur téléphone ou
            leur verre.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Votre côté de la liste est concret : le produit et son transport, les présentoirs, la
            signalétique, l'accueil, le photographe et les besoins techniques liés à la prise de
            parole. À annoncer au devis, car cela conditionne l'espace à réserver et l'heure
            d'installation des prestataires.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour un lancement qui se prolonge, la soirée continue sur place : du jeudi au dimanche, la
            salle reste ouverte jusqu'à 5h, DJ à partir de minuit.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Chiffrer un lancement : les informations qui font gagner du temps
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Quatre données suffisent à bâtir une proposition sérieuse : la date, le nombre d'invités,
            le format — debout ou assis — et l'heure de la prise de parole, qui détermine le reste du
            déroulé. Ajoutez les contraintes alimentaires et les besoins d'installation : la réponse
            arrive avec un menu, un prix par personne et une configuration d'espace.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Pour un comité très restreint, une table réservée en ligne suffit. À partir de dix
            personnes, un espace dédié entre en jeu, et la privatisation partielle prend le relais
            au-delà de cinquante invités. Un interlocuteur unique suit alors le dossier, joignable au{" "}
            <a href={SITE.phoneHref} className="text-primary hover:underline">
              {SITE.phone}
            </a>
            .
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Deux lectures utiles selon votre scénario : le{" "}
            <Link to="/cocktail-dinatoire-paris" className="text-primary hover:underline">
              cocktail dînatoire debout
            </Link>{" "}
            détaille le service en pièces, la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du restaurant
            </Link>{" "}
            compare les trois niveaux d'exclusivité, et la{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise
            </Link>{" "}
            couvre le cas d'un lancement interne. Le{" "}
            <Link to="/galerie" className="text-primary hover:underline">
              aperçu en images du lieu
            </Link>{" "}
            donne une idée des volumes, et la page{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">
              réceptions et événements
            </Link>{" "}
            recense les formats accueillis aux Champs-Élysées.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Lancement de produit : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`lancement-faq-${i}`} className="border-primary/15">
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
              Votre lancement aux Champs-Élysées
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, nombre d'invités, format et heure de révélation : avec ces quatre éléments, vous
              recevez une proposition chiffrée et une configuration d'espace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(LANCEMENT_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Demander un devis lancement
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
