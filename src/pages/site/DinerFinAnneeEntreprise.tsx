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
import hero from "@/assets/site/detail-table.jpg";
import partage from "@/assets/site/restaurant-table.jpg";

const FIN_ANNEE_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser le dîner de fin d'année de mon entreprise. Date envisagée : ... / Nombre de convives : ... / Jour souhaité : ... / Menu ou budget par personne : ...";

const reperes = [
  "L'accueil des groupes commence à 17h, heure d'ouverture de la maison",
  "Arrivées calées par créneaux de 30 minutes, jusqu'à 5h du matin",
  "Lundi à mercredi — dernier service avant minuit, la soirée s'arrête au dîner",
  "Jeudi à dimanche — la salle tient jusqu'à 5h, avec DJ à partir de minuit",
  "Après 22h, on entre par le 59 rue de Ponthieu plutôt que par l'avenue",
  "Environ 250 convives assis, jusqu'à 500 en configuration cocktail",
];

const moments = [
  {
    title: "1. Le bilan de l'année, une fois les convives servis",
    text: "Le discours de direction arrive mieux après l'entrée qu'à l'apéritif : les invités sont assis, le service est lancé, l'attention est disponible. Quinze à vingt minutes suffisent pour un bilan et des remerciements ; au-delà, la salle décroche et le reste du dîner traîne.",
  },
  {
    title: "2. Les remises, au moment où la salle peut bouger",
    text: "Cadeaux, médailles d'ancienneté, tombola de fin d'année : ces intermèdes demandent des allées et venues. Les placer entre le plat et le dessert évite d'interrompre un service en cours, et laisse la fin de repas aux conversations plutôt qu'à l'organisation.",
  },
  {
    title: "3. La bascule, si la date le permet",
    text: "Un dîner qui se prolonge n'a pas besoin de déplacer les invités vers un second lieu. Du jeudi au dimanche, l'ambiance passe en club avec DJ à partir de minuit, dans la même salle, sans vestiaire à récupérer ni adresse à retrouver.",
  },
];

const planTable = [
  "Mélanger les services plutôt que regrouper les bureaux : une table par équipe reproduit la semaine au lieu de créer la soirée.",
  "Placer la direction au centre de la salle, pas en bout de table : un discours porté depuis le milieu du volume s'entend sans micro dans la plupart des configurations.",
  "Garder les nouveaux arrivants à proximité d'un noyau déjà à l'aise : c'est la seule table qui a besoin d'être pensée, les autres se composent d'elles-mêmes.",
  "Prévoir la marge d'effectif avant de figer le plan : entre les accompagnants et les absences de dernière minute, dix à quinze pour cent d'écart sont courants sur un dîner de décembre.",
];

const faq = [
  {
    q: "Quelle différence entre un dîner de fin d'année et un réveillon d'entreprise ?",
    a: "Le réveillon se tient le 31 décembre uniquement, avec une forte tension sur les places. Le dîner de fin d'année se choisit dans une fenêtre plus large, de début novembre à la mi-décembre, ce qui permet de caler la date sur le planning de l'équipe plutôt que de la subir.",
  },
  {
    q: "Quand faut-il réserver un dîner de fin d'année pour un groupe ?",
    a: "Le plus tôt possible dès que la date et l'effectif sont connus, en particulier pour les jeudis et vendredis de novembre et décembre. Un groupe de plus de cinquante convives qui souhaite une partie de salle dédiée a intérêt à se manifester plusieurs semaines à l'avance.",
  },
  {
    q: "Le dîner peut-il se prolonger en soirée dansante ?",
    a: "Oui, du jeudi au dimanche : la salle reste ouverte jusqu'à 5h et l'ambiance bascule en club avec DJ à partir de minuit. Du lundi au mercredi, l'établissement ferme à minuit, ce qui convient à un dîner qui s'achève sans programme dansant.",
  },
  {
    q: "Combien de convives le Prince Palace peut-il recevoir pour un dîner ?",
    a: "Environ 250 personnes en dîner assis, et jusqu'à 500 en configuration cocktail. Un espace dédié est possible dès 10 personnes, une privatisation partielle de 50 à 150 convives, et la privatisation totale du lieu jusqu'à 500.",
  },
  {
    q: "Faut-il un menu unique pour tout le groupe ?",
    a: "Un menu de groupe est défini en amont avec l'organisateur, avec des options végétariennes. Sur un dîner de fin d'année, l'enjeu est moins le choix que le rythme : un menu resserré permet de servir cent couverts dans un temps maîtrisé.",
  },
  {
    q: "Comment obtenir un devis pour le dîner de fin d'année ?",
    a: "Indiquez par WhatsApp la date envisagée, le jour de la semaine souhaité, le nombre de convives et le budget par personne. L'équipe revient avec une proposition chiffrée — plan de salle, menu, créneau d'arrivée — sans engagement.",
  },
];

export default function DinerFinAnneeEntreprise() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Dîner de fin d'année d'entreprise à Paris",
      description:
        "Dîner de fin d'année d'entreprise à Paris 8e : groupe dès 10 personnes, menu de fête, discours et soirée jusqu'à 5h aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/diner-fin-annee-entreprise-paris",
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
        title="Dîner de fin d'année d'entreprise à Paris"
        description="Dîner de fin d'année d'entreprise à Paris 8e : groupe dès 10 personnes, menu de fête, discours et soirée jusqu'à 5h aux Champs-Élysées."
        path="/diner-fin-annee-entreprise-paris"
        jsonLd={jsonLd}
      />

      <HeroSection
        image={hero}
        alt="Table dressée pour un dîner de fin d'année d'entreprise au Prince Palace, Paris 8e"
        priority
      >
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">
            Dîner d'entreprise
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Dîner de fin d'année d'entreprise à Paris
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Réunir l'équipe autour d'une table, de 10 à 500 convives, entre le début novembre et
            la mi-décembre — et prolonger la soirée sur place quand la date le permet.
          </p>
          <a
            href={whatsappLink(FIN_ANNEE_MESSAGE)}
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
            Un dîner de fin d'année n'est pas un réveillon
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Les deux soirées se confondent dans les recherches et se ressemblent peu dans les faits.
            Un réveillon se joue le 31 décembre : une seule date, aucune latitude, et une pression
            immédiate sur les places. Un dîner de fin d'année d'entreprise se choisit dans une
            fenêtre de six semaines environ, du début novembre à la mi-décembre. Ce n'est pas un
            détail de calendrier : la date devient un paramètre que l'on arbitre, au même titre que
            le nombre de convives.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            La mécanique est celle du restaurant, pas celle d'une salle de réception à monter. Les
            groupes sont accueillis dès 17h, à l'ouverture, et les arrivées se calent par créneaux
            de 30 minutes jusqu'à 5h du matin. Une table dressée attend les convives, la cuisine
            tourne, le service est en place : l'organisateur n'a ni traiteur à chercher ni mobilier
            à louer, et il connaît son heure de fin avant même de fixer la date.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            La date décide de l'heure de fin, pas l'inverse
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            C'est le premier arbitrage à poser avec la direction, souvent avant même de parler
            budget. Le jour de la semaine détermine jusqu'où la soirée peut aller, et donc le format
            à annoncer aux équipes.
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
            Un mardi de novembre ferme à minuit : le dîner occupe la soirée et chacun repart à une
            heure raisonnable, ce qui rassure sur le lendemain de travail. Un jeudi de décembre
            laisse la salle ouverte jusqu'à 5h et transforme le repas en soirée complète. Les deux
            fonctionnent ; ils ne racontent pas la même chose à une équipe, et le choix se prend
            avec le responsable, pas par défaut.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Trois moments à caser avant de choisir le menu
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Un dîner de fin d'année n'est pas seulement un repas : il porte des prises de parole et
            des rituels d'entreprise. Les placer au bon moment dans le service évite les trois
            écueils classiques — un discours qui tombe dans le bruit de l'apéritif, des remises qui
            coupent le plat, une fin de soirée qui s'étire faute de programme.
          </p>
          <div className="space-y-8 mb-8">
            {moments.map((m) => (
              <div key={m.title}>
                <h3 className="font-playfair text-xl mb-2 text-primary">{m.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
          <img
            src={partage}
            alt="Planche à partager sur une table de groupe lors d'un dîner d'entreprise à Paris"
            width={1200}
            height={900}
            loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20"
          />
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Le plan de table est le vrai sujet du dîner
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Passé cinquante convives, la composition des tables pèse plus lourd sur l'ambiance que
            le contenu des assiettes. Quatre règles suffisent le plus souvent à éviter la soirée où
            chacun retrouve son voisin de bureau.
          </p>
          <ul className="space-y-3 mb-8">
            {planTable.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Côté salle, trois volumes se dessinent selon l'effectif : un espace dédié dès dix
            personnes, une partie du lieu fermée pour l'entreprise de 50 à 150 convives, et le
            restaurant entier jusqu'à 500 en cocktail, avec environ 250 couverts en dîner assis. Le
            mobilier suit le plan retenu, sans location supplémentaire.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">
            Ce qu'il faut envoyer pour obtenir un devis utile
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Quatre informations suffisent à produire une réponse chiffrée et exploitable : la date
            ou la semaine envisagée, le jour de la semaine souhaité, le nombre de convives et le
            budget par personne. Le créneau d'arrivée et la présence d'un discours complètent le
            cadrage et changent parfois le plan de salle.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Le prix d'un dîner de fin d'année dépend de ces variables, pas d'un tarif affiché : la
            période retenue, l'effectif, le format assis ou cocktail, le menu et les boissons
            composent l'essentiel de la proposition. Rien ne se confirme avant que ces quatre
            éléments soient posés.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Pour situer ce dîner parmi les autres formats, la page{" "}
            <Link to="/soiree-entreprise-paris" className="text-primary hover:underline">
              soirée d'entreprise à Paris
            </Link>{" "}
            décrit les déroulés complets, celle du{" "}
            <Link to="/diner-groupe-restaurant-paris" className="text-primary hover:underline">
              dîner de groupe
            </Link>{" "}
            explique l'assemblage des grandes tables, et la{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">
              privatisation du restaurant
            </Link>{" "}
            détaille les niveaux d'exclusivité. Pour une date au 31 décembre, voir le{" "}
            <Link to="/reveillon-entreprise-paris" className="text-primary hover:underline">
              réveillon d'entreprise
            </Link>{" "}
            ; pour le cadre général du lieu, la{" "}
            <Link to="/restaurant" className="text-primary hover:underline">
              présentation du restaurant
            </Link>{" "}
            et la{" "}
            <Link to="/galerie" className="text-primary hover:underline">
              galerie photo
            </Link>
            . Réservations et renseignements au {SITE.phone}.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Dîner de fin d'année : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`fin-annee-faq-${i}`} className="border-primary/15">
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
              Fixons la date de votre dîner de fin d'année
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Date, jour souhaité, nombre de convives, budget par personne : demandez un devis ou
              réservez directement pour un groupe plus réduit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappLink(FIN_ANNEE_MESSAGE)}
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
