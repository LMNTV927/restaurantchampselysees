import dish1 from "@/assets/dish-1.webp";
import dish1Sm from "@/assets/dish-1-sm.webp";
import dish2 from "@/assets/dish-2.webp";
import dish2Sm from "@/assets/dish-2-sm.webp";
import dish3 from "@/assets/dish-3.webp";
import dish3Sm from "@/assets/dish-3-sm.webp";
import dish4 from "@/assets/dish-4.webp";
import dish4Sm from "@/assets/dish-4-sm.webp";
import dish5 from "@/assets/dish-5.webp";
import dish5Sm from "@/assets/dish-5-sm.webp";
import dish6 from "@/assets/dish-6.webp";
import dish6Sm from "@/assets/dish-6-sm.webp";
import dish7 from "@/assets/dish-7.webp";
import dish7Sm from "@/assets/dish-7-sm.webp";
import dish8 from "@/assets/dish-8.webp";
import dish8Sm from "@/assets/dish-8-sm.webp";

export interface DishImage {
  src: string;
  srcSm: string;
}

export const DISH_IMAGES: DishImage[] = [
  { src: dish1, srcSm: dish1Sm },
  { src: dish2, srcSm: dish2Sm },
  { src: dish3, srcSm: dish3Sm },
  { src: dish4, srcSm: dish4Sm },
  { src: dish5, srcSm: dish5Sm },
  { src: dish6, srcSm: dish6Sm },
  { src: dish7, srcSm: dish7Sm },
  { src: dish8, srcSm: dish8Sm },
];

export const PRINCE_PALACE_LOGO = "/prince-palace-logo-256.webp";
