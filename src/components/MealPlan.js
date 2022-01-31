import React from "react";
import "bulma/css/bulma.min.css";
import { Form } from "react-bulma-components";

function Mealplan({ mealPlan, mealPlanController, updateMealPlan }) {
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
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    return (
      <Form.Field>
        <Form.Label>{`Essen für ${dayName}`}</Form.Label>
        <Form.Control>
          <Form.Input
            color="success"
            value={mealPlan[dayNumber]}
            onChange={(e) => {
              mealPlanController.addMealFor(days[dayNumber], e.target.value);
              updateMealPlan(mealPlanController.getOverview());
            }}
          />
        </Form.Control>
      </Form.Field>
    );
  }
}

export default Mealplan;
