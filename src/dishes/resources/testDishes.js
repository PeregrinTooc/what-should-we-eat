import { createDishWithProperties } from "../Dish";

export const mondayDishName = "Ofengemüse mit Kartoffeln und Tzatziki";
export const mondayDish = createDishWithProperties({
  dishName: mondayDishName,
  effort: 3,
  tags: ["Kartoffeln", "Ofen"],
  healthLevel: 7,
});
