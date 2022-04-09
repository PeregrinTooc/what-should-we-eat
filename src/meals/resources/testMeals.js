import { createMealWithProperties } from "../meal";

export const mondayMealName = "Ofengemüse mit Kartoffeln und Tzatziki";
export const mondayMeal = createMealWithProperties({
  mealName: mondayMealName,
  effort: 3,
  tags: ["Kartoffeln", "Ofen"],
  healthLevel: 7,
});
