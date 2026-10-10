import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { HeroSection } from "@/components/Site/HeroSection";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink } from "@/lib/siteConfig";
import vibe from "@/assets/site/vibe-2.jpg";
import eventSoiree from "@/assets/site/event-soiree.jpg";

const EVJF_MESSAGE =
  "Bonjour Prince Palace, je souhaite organiser un EVJF. Date souhaitée : ... / Nombre de personnes : ...";

const faq = [
  {
    q: "Où fêter un EVJF à Paris ?",
    a: "Le Prince Palace, au 76 avenue des Champs-Élysées, réunit dîner et soirée club au même endroit : le restaurant ouvre à 17h et la partie club démarre à partir de 1h du matin, jusqu'à 5h du jeudi au dimanche. Le groupe n'a pas besoin de changer de lieu dans la nuit.",
  },
  {
    q: "À partir de combien de personnes peut-on réserver pour un EVJF ?",
    a: "Les petits groupes réservent directement en ligne. À partir de 10 personnes, un espace dédié peut être prévu dans la salle, et pour les grands groupes une privatisation partielle ou totale est possible sur devis.",
  },
  {
    q: "Combien de temps dure la réservation de la table ?",
    a: "Une réservation correspond à un créneau de 3 heures au restaurant. Pour une soirée plus longue ou un format sur mesure, demandez un devis sur WhatsApp.",
  },
  {
    q: "La réservation au restaurant donne-t-elle accès au club ?",
    a: "Non, une réservation au restaurant ne donne pas automatiquement accès à la partie club. Signalez-le dans votre demande de devis pour que l'équipe vous propose la bonne formule.",
  },
];

export default function Evjf() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "EVJF à Paris : dîner, DJ et soirée club aux Champs-Élysées",
      description:
        "Organiser un enterrement de vie de jeune fille à Paris : dîner dès 17h, espace dédié dès 10 personnes, DJ et club jusqu'à 5h aux Champs-Élysées.",
      author: { "@type": "Organization", name: "Prince Palace" },
      publisher: { "@type": "Organization", name: "Prince Palace" },
      mainEntityOfPage: "https://restaurantchampselysees.fr/evjf-paris-champs-elysees",
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
        title="EVJF à Paris : dîner, DJ et soirée club aux Champs-Élysées"
        description="Enterrement de vie de jeune fille à Paris : dîner dès 17h, espace dédié dès 10 personnes, DJ et ambiance club jusqu'à 5h au Prince Palace, Champs-Élysées."
        path="/evjf-paris-champs-elysees"
        jsonLd={jsonLd}
      />

      <HeroSection image={vibe} alt="Groupe d'amies fêtant un EVJF au Prince Palace à Paris" priority>
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.35em] text-primary text-xs sm:text-sm mb-5">EVJF</p>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            EVJF à Paris aux Champs-Élysées
          </h1>
          <p className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8">
            Un dîner entre amies, puis la piste de danse avec DJ : offrez à la future mariée une
            soirée inoubliable, du premier toast jusqu'au bout de la nuit.
          </p>
          <a href={whatsappLink(EVJF_MESSAGE)} target="_blank" rel="noopener noreferrer"
            className="premium-button inline-block bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold">
            Organiser mon EVJF
          </a>
        </div>
      </HeroSection>

      <article className="container py-20 sm:py-28 max-w-3xl">
        <Reveal>
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Pourquoi fêter un EVJF au Prince Palace ?</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Organiser un enterrement de vie de jeune fille à Paris, c'est souvent jongler entre un
            restaurant, un bar et une boîte de nuit. Ici, tout se passe au même endroit : le dîner
            est servi dès 17h, et la soirée se prolonge en ambiance club, sans taxi ni file d'attente
            entre deux adresses.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Situé au 76 avenue des Champs-Élysées, le lieu est facile d'accès pour toutes vos
            invitées, qu'elles arrivent en métro ou de l'extérieur de Paris. Avec 500 places, il
            accueille aussi bien un petit groupe de copines qu'un grand EVJF réunissant famille et
            amies.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Le déroulé d'une soirée EVJF</h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-playfair text-xl mb-2 text-primary">Le dîner entre amies</h3>
              <p className="text-muted-foreground leading-relaxed">
                Réservez votre table sur un créneau de 30 minutes à partir de 17h. Une réservation
                correspond à un créneau de 3 heures : le temps de dîner, de trinquer et d'ouvrir les
                cadeaux de la future mariée.
              </p>
            </div>
            <div>
              <h3 className="font-playfair text-xl mb-2 text-primary">La soirée avec DJ</h3>
              <p className="text-muted-foreground leading-relaxed">
                Du jeudi au dimanche, la partie club démarre à partir de 1h du matin et la fête
                continue jusqu'à 5h. Une réservation au restaurant ne donne pas automatiquement accès
                au club : précisez-le dans votre demande pour que l'équipe prévoie la bonne formule.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <img src={eventSoiree} alt="Soirée dansante avec DJ pour un enterrement de vie de jeune fille à Paris"
            width={1600} height={1072} loading="lazy"
            className="rounded-2xl w-full object-cover aspect-[4/3] border border-primary/20 mb-8" />
          <h2 className="font-playfair text-3xl sm:text-4xl mb-6">Nos conseils pour organiser votre EVJF</h2>
          <ul className="space-y-3 mb-8">
            {[
              "Réservez tôt pour les vendredis et samedis, les plus demandés",
              "Un espace dédié est possible à partir de 10 personnes",
              "À partir de 22h, l'accès au restaurant se fait par le 59 rue de Ponthieu",
              "Pour un grand groupe, demandez une privatisation partielle ou totale",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Vous préparez aussi un autre événement ? Découvrez nos pages{" "}
            <Link to="/anniversaire-restaurant-paris" className="text-primary hover:underline">anniversaire à Paris</Link>,{" "}
            <Link to="/privatisation-restaurant-paris" className="text-primary hover:underline">privatisation de restaurant</Link> et{" "}
            <Link to="/evenementiel" className="text-primary hover:underline">événementiel</Link>.
          </p>
        </Reveal>
      </article>

      <section className="container py-20 sm:py-28 border-t border-primary/10">
        <Reveal className="max-w-2xl mb-14">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Questions fréquentes</p>
          <h2 className="font-playfair text-3xl sm:text-4xl">EVJF à Paris : vos questions</h2>
        </Reveal>
        <Reveal className="max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`evjf-faq-${i}`} className="border-primary/15">
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
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">Fêtez la future mariée au Prince Palace</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Réservez votre table en ligne ou décrivez-nous votre EVJF pour recevoir une proposition.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={SITE.bookingPath} className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold">
                Réserver une table
              </a>
              <a href={whatsappLink(EVJF_MESSAGE)} target="_blank" rel="noopener noreferrer"
                className="premium-button border border-primary/50 text-primary px-8 py-4">
                Demander un devis
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
