import { createMealFromJSON } from "../meal";

export const mondayMealName = "Ofengemüse mit Kartoffeln und Tzatziki";
export const mondayMeal = createMealFromJSON(
  JSON.stringify({
    mealName: mondayMealName,
    effort: 3,
    tags: ["Kartoffeln"],
    healthLevel: 7,
  })
);
