import React from "react";
import "bulma/css/bulma.min.css";
import { Columns, Container, Heading } from "react-bulma-components";
import { createEmptyMealPlan } from "./meals/mealPlan.tsx";
import { createMealFromJSON } from "./meals/meal.tsx";

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
  mealPlan.addMealFor(0, mondayMeal);
  return (
    <Container>
      <Heading>Was wollen wir essen?</Heading>
      <Columns centered={true}>
        <Columns.Column size={"one-quarter"}>
          {mealPlan.render()}
        </Columns.Column>
        <Columns.Column></Columns.Column>
      </Columns>
    </Container>
  );
}

export default App;
