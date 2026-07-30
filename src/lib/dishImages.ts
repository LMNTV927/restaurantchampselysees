// Build-time optimised (WebP, resized) background images shared by the
// customer-facing pages. Keeps the original multi-MB JPEGs out of the bundle.
import dish1 from "@/assets/dish-1.jpg?w=1280&format=webp&quality=68";
import dish2 from "@/assets/dish-2.jpg?w=1280&format=webp&quality=68";
import dish3 from "@/assets/dish-3.jpg?w=1280&format=webp&quality=68";
import dish4 from "@/assets/dish-4.jpg?w=1280&format=webp&quality=68";

export const dishImages = [dish1, dish2, dish3, dish4];
