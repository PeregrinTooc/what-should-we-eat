import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Form, Button, Icon, Block } from "react-bulma-components";

function Mealplan() {
  const [mealPlan, updateMealPlan] = useState([
    "Montagsessen",
    "Dienstagsessen",
    "Mittwochsessen",
    "Donnerstagsessen",
    "Freitagsessen",
    "Samstagsessen",
    "Sonntagsessen",
  ]);

  return (
    <form>
      {createMealPlanForm("Montag", 0)}
      {createMealPlanForm("Dienstag", 1)}
      {createMealPlanForm("Mittwoch", 2)}
      {createMealPlanForm("Donnerstag", 3)}
      {createMealPlanForm("Freitag", 4)}
      {createMealPlanForm("Samstag", 5)}
      {createMealPlanForm("Sonntag", 6)}
    </form>
  );

  function createMealPlanForm(dayName, dayNumber) {
    return (
      <Form.Field>
        <Form.Label>{`Essen für ${dayName}`}</Form.Label>
        <Form.Control>
          <Form.Input
            color="success"
            value={mealPlan[dayNumber]}
            onChange={(e) => {
              return updateMealPlan([
                ...mealPlan.slice(0, dayNumber),
                ...[e.target.value],
                ...mealPlan.slice(dayNumber + 1, 7),
              ]);
            }}
          />
        </Form.Control>
      </Form.Field>
    );
  }
}

export default Mealplan;
