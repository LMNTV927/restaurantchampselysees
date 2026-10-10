import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import hero from "@/assets/site/hero-lounge.jpg";
import table from "@/assets/site/detail-table.jpg";

const PRO_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser une soirée d'entreprise. Entreprise : ... / Date souhaitée : ... / Nombre de personnes : ... / Format (cocktail, dîner, soirée) : ...";

const faq = [
  {
    q: "Combien de collaborateurs peut-on accueillir pour une soirée d'entreprise ?",
    a: "Le Prince Palace offre une capacité de 500 places. Un espace dédié convient aux équipes à partir de 10 personnes, la privatisation partielle accueille de 50 à 150 invités, et la privatisation totale ouvre tout le lieu à votre entreprise.",
  },
  {
    q: "Quels formats de soirée d'entreprise proposez-vous ?",
    a: "Afterwork dès 17h, cocktail dînatoire, dîner assis, soirée de fin d'année, séminaire suivi d'un dîner ou lancement de produit : le format est construit avec vous selon le nombre d'invités et l'objectif de l'événement.",
  },
  {
    q: "Comment obtenir un devis pour un événement d'entreprise ?",
    a: "Envoyez-nous la date envisagée, le nombre de participants et le format souhaité par WhatsApp. L'équipe vous répond avec une proposition détaillée avant toute confirmation.",
  },
  {
    q: "Jusqu'à quelle heure peut durer la soirée ?",
    a: "Le restaurant ouvre à 17h. Du lundi au mercredi, il ferme à minuit. Du jeudi au dimanche, la soirée peut se prolonger jusqu'à 5h, avec la partie club à partir de 1h du matin. À partir de 22h, l'accès se fait par le 59 rue de Ponthieu.",
  },
];

const formats = [
  { title: "Afterwork d'équipe", text: "Dès 17h, retrouvez vos collaborateurs autour de cocktails et d'un dîner, à deux pas des bureaux du 8e arrondissement." },
  { title: "Cocktail ou dîner assis", text: "Pour remercier des clients, fêter un résultat ou réunir un service : cocktail dînatoire debout ou dîner servi à table, selon l'ambiance recherchée." },
  { title: "Soirée de fin d'année", text: "Dîner, discours, puis piste de danse avec DJ : la soirée de Noël ou de fin d'année se déroule entièrement au même endroit." },
  { title: "Lancement et réception", text: "Lancement de produit, anniversaire d'entreprise ou réception de partenaires : une adresse prestigieuse sur les Champs-Élysées pour marquer les esprits." },
];

export default function SoireeEntreprise() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Soirée d'entreprise à Paris : 500 places aux Champs-Élysées",
      description:
        "Organiser une soirée d'entreprise à Paris : afterwork, cocktail, dîner assis ou soirée de fin d'année avec DJ, jusqu'à 500 invités aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/soiree-entreprise-paris",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    },
  ];

  return (
    <>
      <Seo
        title="Soirée d'entreprise à Paris : 500 places aux Champs-Élysées"
        description="Soirée d'entreprise à Paris : afterwork, cocktail, dîner assis ou soirée de fin d'année avec DJ, de 10 à 500 invités au Prince Palace, Champs-Élysées. Devis sur mesure."
        path="/soiree-entreprise-paris"
        jsonLd={jsonLd}
      />

      <HeroSection image={hero} alt="Salle du Prince Palace préparée pour une soirée d'entreprise à Paris" priority>
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">Entreprises</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Soirée d'entreprise à Paris
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Afterwork, cocktail, dîner de gala ou soirée de fin d'année : recevez vos équipes et
            vos clients sur les Champs-Élysées, de 10 à 500 invités.
          </p>
          <a href={whatsappLink(PRO_MESSAGE)} target="_blank" rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold">
            Demander un devis entreprise
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Un lieu d'événement d'entreprise au cœur de Paris</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Trouver un lieu pour une soirée d'entreprise à Paris demande de concilier plusieurs
            critères : une adresse facile d'accès, une capacité adaptée au nombre de participants et
            une équipe capable de gérer le dîner comme la soirée. Le Prince Palace, au 76 avenue
            des Champs-Élysées, répond à ces trois besoins.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Avec 500 places, le lieu s'adapte à un dîner d'équipe comme à un grand événement
            réunissant plusieurs services. Le format restaurant-club permet de passer
            naturellement du repas à la fête, sans déplacer vos invités.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Les formats de soirée d'entreprise</h2>
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
          <img src={table} alt="Table dressée pour un dîner d'entreprise aux Champs-Élysées"
            width={1600} height={1072} loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mb-8" />
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Espace dédié ou privatisation</h2>
          <ul className="space-y-3 mb-8">
            {[
              "Espace dédié dans la salle à partir de 10 personnes",
              "Privatisation partielle de 50 à 150 invités",
              "Privatisation totale jusqu'à 500 invités",
              "DJ en soirée, club à partir de 1h du jeudi au dimanche",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Pour en savoir plus, consultez nos pages{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">privatisation de restaurant à Paris</Link>,{" "}
            <Link to="/afterwork-paris-champs-elysees" className="text-primary hover:underline">afterwork à Paris</Link> et{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">événementiel</Link>.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Comment organiser votre soirée ?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Indiquez-nous par WhatsApp la date, le nombre de participants et le format souhaité.
            L'équipe vous envoie une proposition détaillée (plan de salle, restauration, déroulé)
            avant toute confirmation. Pour une équipe de moins de 10 personnes, la réservation en
            ligne suffit.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">Soirée d'entreprise : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`pro-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Recevez vos équipes au Prince Palace</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Obtenez une proposition sur mesure pour votre événement d'entreprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={whatsappLink(PRO_MESSAGE)} target="_blank" rel="noopener noreferrer"
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold">
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
