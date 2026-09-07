import { Seo } from "@/components/Site/Seo";
import { SITE } from "@/lib/siteConfig";

export default function MentionsLegales() {
  return (
    <>
      <Seo
        title="Mentions légales & CGU | Prince Palace Paris"
        description="Mentions légales, conditions générales d'utilisation et politique de confidentialité du site du Prince Palace, Paris 8."
        path="/mentions-legales"
      />

      <section className="container pt-32 sm:pt-40 pb-24 max-w-3xl">
        <h1 className="font-playfair text-4xl sm:text-5xl mb-10">Mentions légales & CGU</h1>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="font-playfair text-xl text-foreground mb-3">Éditeur du site</h2>
            <p>
              Prince Palace — {SITE.addressPrimary}. Téléphone : {SITE.phone}. E-mail : {SITE.email}.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-xl text-foreground mb-3">Hébergement</h2>
            <p>
              Le site est hébergé par un prestataire d'hébergement web dont les coordonnées peuvent
              être communiquées sur simple demande à l'adresse e-mail ci-dessus.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-xl text-foreground mb-3">Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur ce site (textes, photographies, logos, éléments
              graphiques) est protégé. Toute reproduction, même partielle, est interdite sans
              autorisation écrite préalable.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-xl text-foreground mb-3">Réservations</h2>
            <p>
              Les réservations effectuées en ligne donnent lieu à une confirmation par e-mail et par
              SMS. Elles peuvent être modifiées ou annulées à l'aide des liens fournis dans cette
              confirmation. En cas de forte affluence, l'établissement se réserve la possibilité
              d'adapter le placement des tables.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-xl text-foreground mb-3">Données personnelles</h2>
            <p>
              Les informations collectées lors d'une réservation (nom, téléphone, e-mail) sont
              utilisées uniquement pour la gestion de votre venue et les communications qui s'y
              rapportent. Conformément à la réglementation en vigueur, vous disposez d'un droit
              d'accès, de rectification et de suppression de vos données en écrivant à {SITE.email}.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-xl text-foreground mb-3">Cookies et mesure d'audience</h2>
            <p>
              Ce site utilise des outils de mesure d'audience et de suivi publicitaire afin
              d'améliorer la qualité de ses services. Vous pouvez configurer votre navigateur pour
              refuser le dépôt de ces cookies.
            </p>
          </div>

          <div>
            <h2 className="font-playfair text-xl text-foreground mb-3">Responsabilité</h2>
            <p>
              L'établissement s'efforce d'assurer l'exactitude des informations publiées. Sa
              responsabilité ne saurait être engagée en cas d'erreur, d'omission ou d'indisponibilité
              temporaire du site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
