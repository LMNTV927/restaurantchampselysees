import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Seo } from "@/components/Site/Seo";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";

const faq = [
  {
    q: "Quelle est la capacité d'accueil du Prince Palace ?",
    a: "Nous pouvons recevoir jusqu'à 500 personnes en configuration cocktail et environ 250 convives assis. Plusieurs espaces peuvent être réservés séparément pour des groupes plus restreints.",
  },
  {
    q: "Quels sont vos horaires ?",
    a: "Le service du soir démarre à 17h et se poursuit tard dans la nuit. Les réservations en ligne se font par créneaux de 30 minutes entre 17h et 5h.",
  },
  {
    q: "À quelle heure ouvre le club ?",
    a: "Tous les soirs, à partir de minuit, la salle passe en ambiance club avec DJ, jusqu'à 5h du matin.",
  },
  {
    q: "Peut-on réserver une table pour la soirée club ?",
    a: "Oui. Choisissez un créneau à partir de minuit lors de votre réservation en ligne, ou appelez-nous au 01 59 13 32 68 pour un groupe.",
  },
  {
    q: "Peut-on privatiser l'établissement ?",
    a: "Oui, en partie ou en totalité. La privatisation partielle convient de 50 à 150 invités, la privatisation totale jusqu'à 500 personnes. Chaque demande fait l'objet d'un devis sur mesure.",
  },
  {
    q: "Comment obtenir un devis pour un événement ?",
    a: "Contactez-nous directement par WhatsApp ou par téléphone en précisant la date souhaitée, le nombre d'invités et le type d'occasion. Nous revenons vers vous avec une proposition chiffrée.",
  },
  {
    q: "Faut-il réserver pour dîner ?",
    a: "C'est vivement conseillé, en particulier le week-end et les soirs d'événement. La réservation en ligne prend moins d'une minute.",
  },
  {
    q: "Y a-t-il un dress code ?",
    a: "Une tenue soignée est demandée. Les tenues de sport et les shorts ne sont pas admis en soirée.",
  },
  {
    q: "Le lieu est-il accessible aux personnes à mobilité réduite ?",
    a: "L'accès principal est de plain-pied. Signalez-nous votre venue à l'avance et notre équipe organise l'accueil et le placement en conséquence.",
  },
  {
    q: "Comment venir et où se garer ?",
    a: "Nous sommes au 76 Avenue des Champs-Élysées, avec une entrée également au 59 rue de Ponthieu, Paris 8. Les métros George V et Franklin D. Roosevelt sont à quelques minutes, et plusieurs parkings publics se trouvent à proximité immédiate.",
  },
  {
    q: "Une réservation est-elle définitive ?",
    a: "Vous recevez une confirmation par e-mail et par SMS, avec des liens pour modifier ou annuler votre réservation à tout moment.",
  },
];

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Seo
        title="FAQ | Prince Palace, restaurant événementiel Champs-Élysées"
        description="Capacité, horaires, privatisation, dress code, accès PMR et réservation : toutes les réponses sur le Prince Palace, Paris 8."
        path="/faq"
        jsonLd={jsonLd}
      />

      <section className="container pt-32 sm:pt-40 pb-10">
        <Reveal className="max-w-2xl">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">FAQ</p>
          <h1 className="font-playfair text-4xl sm:text-5xl mb-5">Questions fréquentes</h1>
          <p className="text-muted-foreground leading-relaxed">
            Vous ne trouvez pas votre réponse ? Écrivez-nous, nous répondons rapidement.
          </p>
        </Reveal>
      </section>

      <section className="container pb-20 sm:pb-28 max-w-3xl">
        <Reveal>
          <Accordion type="single" collapsible className="premium-card px-6 border-primary/15">
            {faq.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`} className="border-primary/10">
                <AccordionTrigger className="text-left font-playfair text-base sm:text-lg hover:text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal className="mt-10 flex flex-col sm:flex-row gap-3">
          <a
            href={SITE.bookingPath}
            className="premium-button bg-gradient-gold text-primary-foreground px-7 py-3 text-center font-medium"
          >
            Réserver une table
          </a>
          <a
            href={whatsappLink(DEVIS_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button border border-primary/50 text-primary px-7 py-3 text-center"
          >
            Demander un devis événementiel
          </a>
          <Link to="/evenementiel" className="premium-button border border-primary/50 text-primary px-7 py-3 text-center">
            Voir l'événementiel
          </Link>
        </Reveal>
      </section>
    </>
  );
}
