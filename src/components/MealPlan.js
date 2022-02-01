import React from "react";
import "bulma/css/bulma.min.css";
import { Form } from "react-bulma-components";

function Mealplan({ mealPlan, mealPlanController, updateMealPlan }) {
  return (
    <div>
      <form> {createMealPlanForm("Montag", 0)}</form>
      <form> {createMealPlanForm("Dienstag", 1)}</form>
      <form> {createMealPlanForm("Mittwoch", 2)}</form>
      <form> {createMealPlanForm("Donnerstag", 3)}</form>
      <form> {createMealPlanForm("Freitag", 4)}</form>
      <form> {createMealPlanForm("Samstag", 5)}</form>
      <form> {createMealPlanForm("Sonntag", 6)}</form>
    </div>
  );

  function createMealPlanForm(dayName, dayNumber) {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    return (
      <Form.Field>
        <Form.Label htmlFor={`dayNameForm-${dayName}`}>
          {`Essen für ${dayName}`}{" "}
        </Form.Label>
        <Form.Control>
          <Form.Input
            id={`dayNameForm-${dayName}`}
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
