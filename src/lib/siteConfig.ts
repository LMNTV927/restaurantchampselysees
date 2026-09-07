export const SITE = {
  name: "Prince Palace",
  tagline: "Restaurant & Lounge événementiel — Champs-Élysées, Paris 8",
  phone: "01 59 13 32 68",
  phoneHref: "tel:+33159133268",
  email: "princepalace.champselysees@gmail.com",
  whatsapp: "33604674007",
  addressPrimary: "76 Avenue des Champs-Élysées, 75008 Paris",
  addressSecondary: "59 rue de Ponthieu, 75008 Paris",
  restaurantSite: "https://princepalace.fr",
  instagram: "https://www.instagram.com/princepalace_paris/",
  facebook: "https://www.facebook.com/princepalaceparis/",
  tiktok: "https://www.tiktok.com/@princepalaceparis",
  bookingPath: "/book/site-internet",
  capacity: 500,
};

export const whatsappLink = (message: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

export const DEVIS_MESSAGE =
  "Bonjour Prince Palace, je souhaite un devis pour un événement privé. Type d'événement : ... / Date souhaitée : ... / Nombre de personnes : ...";
