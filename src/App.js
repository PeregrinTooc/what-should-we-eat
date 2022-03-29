import React from "react";
import "bulma/css/bulma.min.css";
import { createEmptyMealPlan } from "./meals/mealPlan.tsx";
import { createMealFromJSON } from "./meals/meal.tsx";
import { createRecipeBookFromJson } from "./meals/recipeBook.tsx";
import { createDesk } from "./desk.tsx";

function App() {
  const mealPlan = createEmptyMealPlan();
  const mondayMealName = "Ofengemüse mit Kartoffeln und Tzatziki";
  const mondayMeal = createMealFromJSON(
    JSON.stringify({
      mealName: mondayMealName,
      effort: 3,
      tags: ["Kartoffeln"],
      healthLevel: 7,
    })
  );
  const recipeBook = createRecipeBookFromJson(
    JSON.stringify([
      mondayMeal,
      { mealName: "Foo", tags: ["foo", "bar"], effort: 2, healthLevel: 4 },
    ])
  );
  mealPlan.addMealFor(0, mondayMeal);
  const desk = createDesk(mealPlan, recipeBook)
  return (
    <>{desk.render()}</>
  );
}

export default App;
