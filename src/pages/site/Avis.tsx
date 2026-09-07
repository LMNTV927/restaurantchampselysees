import { Link } from "react-router-dom";
import { Quote, Star } from "lucide-react";
import { Seo } from "@/components/Site/Seo";
import { Reveal } from "@/components/Site/Reveal";
import { SITE, whatsappLink, DEVIS_MESSAGE } from "@/lib/siteConfig";

const avis = [
  {
    name: "Camille",
    context: "Anniversaire, 24 personnes",
    text: "Accueil impeccable et salle magnifique. L'équipe a préparé la table à l'avance et l'arrivée du gâteau a marqué tout le monde.",
  },
  {
    name: "Sofiane",
    context: "Dîner entre amis",
    text: "Une adresse discrète à deux pas de l'avenue, avec un service attentionné et des assiettes généreuses. On est restés bien après le dessert.",
  },
  {
    name: "Marie-Ange",
    context: "EVJF, 18 personnes",
    text: "Tout était organisé à l'avance, du placement à la décoration. Nous avons pu profiter de la soirée sans rien gérer.",
  },
  {
    name: "Direction Kléber Conseil",
    context: "Cocktail d'entreprise, 90 invités",
    text: "Un interlocuteur unique du devis à la fin de soirée, un cadre élégant et un timing respecté à la minute. Nous reviendrons.",
  },
  {
    name: "Yanis",
    context: "Soirée privée",
    text: "L'ambiance monte doucement au fil de la soirée, la lumière et la musique sont parfaitement dosées. Le lieu se prête très bien aux photos.",
  },
  {
    name: "Laura",
    context: "Dîner en couple",
    text: "Une salle feutrée et un service discret. Idéal pour un dîner tardif dans le quartier des Champs-Élysées.",
  },
];

export default function Avis() {
  return (
    <>
      <Seo
        title="Avis clients | Prince Palace, événementiel Champs-Élysées"
        description="Ce que disent nos clients du Prince Palace : soirées privées, anniversaires, cocktails d'entreprise et dîners aux Champs-Élysées, Paris 8."
        path="/avis"
      />

      <section className="container pt-32 sm:pt-40 pb-14">
        <Reveal className="max-w-2xl">
          <p className="uppercase tracking-[0.3em] text-primary text-xs mb-4">Avis</p>
          <h1 className="font-playfair text-4xl sm:text-5xl mb-5">Ils ont célébré chez nous</h1>
          <p className="text-muted-foreground leading-relaxed">
            Anniversaires, EVJF, soirées d'entreprise ou simples dîners : quelques retours de nos
            clients sur leur passage au Prince Palace.
          </p>
        </Reveal>
      </section>

      <section className="container pb-20 sm:pb-28">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {avis.map((a, i) => (
            <Reveal key={a.name} delay={i * 70}>
              <article className="premium-card h-full p-7 border-primary/15 hover:border-primary/40 transition-all duration-500">
                <Quote className="h-6 w-6 text-primary mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{a.text}</p>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 text-primary fill-current" />
                  ))}
                </div>
                <p className="font-playfair text-base">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.context}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/10 bg-gradient-subtle">
        <div className="container py-20 text-center">
          <Reveal>
            <h2 className="font-playfair text-3xl sm:text-4xl mb-5">À votre tour</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Réservez une table ou confiez-nous l'organisation de votre événement privé.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SITE.bookingPath}
                className="premium-button bg-gradient-gold text-primary-foreground px-8 py-4 font-medium shadow-gold"
              >
                Réserver une table
              </a>
              <a
                href={whatsappLink(DEVIS_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button border border-primary/50 text-primary px-8 py-4"
              >
                Demander un devis événementiel
              </a>
              <Link to="/evenementiel" className="premium-button border border-primary/50 text-primary px-8 py-4">
                Voir l'événementiel
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
