import dish1 from "@/assets/dish-1.webp";
import dish1Sm from "@/assets/dish-1-sm.webp";
import dish2 from "@/assets/dish-2.webp";
import dish2Sm from "@/assets/dish-2-sm.webp";
import dish3 from "@/assets/dish-3.webp";
import dish3Sm from "@/assets/dish-3-sm.webp";
import dish4 from "@/assets/dish-4.webp";
import dish4Sm from "@/assets/dish-4-sm.webp";

export interface DishImage {
  src: string;
  srcSm: string;
}

export const DISH_IMAGES: DishImage[] = [
  { src: dish1, srcSm: dish1Sm },
  { src: dish2, srcSm: dish2Sm },
  { src: dish3, srcSm: dish3Sm },
  { src: dish4, srcSm: dish4Sm },
];

export const PRINCE_PALACE_LOGO = "/prince-palace-logo-256.webp";
