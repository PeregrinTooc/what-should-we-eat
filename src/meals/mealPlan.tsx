import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Box, Form } from "react-bulma-components";
import { createEmptyMeal, Meal } from "./meal.tsx";
import { registerDragObserver } from "./recipeBook.tsx";

export enum Days {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

let draggedMeal;
registerDragObserver((meal) => {
  draggedMeal = meal;
});

const mon = { id: Days.Monday, displayName: "Montag" };
const tue = { id: Days.Tuesday, displayName: "Dienstag" };
const wed = { id: Days.Wednesday, displayName: "Mittwoch" };
const thu = { id: Days.Thursday, displayName: "Donnerstag" };
const fri = { id: Days.Friday, displayName: "Freitag" };
const sat = { id: Days.Saturday, displayName: "Samstag" };
const sun = { id: Days.Sunday, displayName: "Sonntag" };

export interface MealPlan {
  addMealFor(day: Days, meal: Meal);
  render();
}

export function createEmptyMealPlan(): MealPlan {
  return new MealPlanImpl();
}

class MealPlanImpl implements MealPlan {
  monMeal: Meal = createEmptyMeal();
  tueMeal: Meal = createEmptyMeal();
  wedMeal: Meal = createEmptyMeal();
  thuMeal: Meal = createEmptyMeal();
  friMeal: Meal = createEmptyMeal();
  satMeal: Meal = createEmptyMeal();
  sunMeal: Meal = createEmptyMeal();
  updateState: Function = () => {};
  observers: Function[] = [];
  registerObserver: Function = (updateState: Function) => {
    this.observers.push(updateState);
  };

  addMealFor(day: Days, meal: Meal) {
    switch (day) {
      case Days.Monday:
        this.monMeal = meal;
        break;
      case Days.Tuesday:
        this.tueMeal = meal;
        break;
      case Days.Wednesday:
        this.wedMeal = meal;
        break;
      case Days.Thursday:
        this.thuMeal = meal;
        break;
      case Days.Friday:
        this.friMeal = meal;
        break;
      case Days.Saturday:
        this.satMeal = meal;
        break;
      case Days.Sunday:
        this.sunMeal = meal;
        break;
    }
    this.observers.forEach((updateState) => {
      updateState({ ...this });
    });
  }
  render() {
    return <MealPlanComponent mealPlan={this} />;
  }
}

function MealPlanComponent({ mealPlan }) {
  const [state, setState] = useState(mealPlan);
  mealPlan.registerObserver(setState);
  return (
    <>
      <MealPlanDayComonent
        dayName={mon.displayName}
        meal={state.monMeal}
        mealplan={this}
      />
      <MealPlanDayComonent
        dayName={tue.displayName}
        meal={state.tueMeal}
        mealplan={this}
      />
      <MealPlanDayComonent
        dayName={wed.displayName}
        meal={state.wedMeal}
        mealplan={this}
      />
      <MealPlanDayComonent
        dayName={thu.displayName}
        meal={state.thuMeal}
        mealplan={this}
      />
      <MealPlanDayComonent
        dayName={fri.displayName}
        meal={state.friMeal}
        mealplan={this}
      />
      <MealPlanDayComonent
        dayName={sat.displayName}
        meal={state.satMeal}
        mealplan={this}
      />
      <MealPlanDayComonent
        dayName={sun.displayName}
        meal={state.sunMeal}
        mealplan={this}
      />
    </>
  );
  function MealPlanDayComonent({ dayName, meal, mealplan }) {
    const [plan, setMealPlan] = useState(mealPlan);
    mealPlan.registerObserver(setMealPlan);
    return (
      <Form.Field key={dayName}>
        <Form.Label htmlFor={`dayNameForm-${dayName}`}>
          {`Essen für ${dayName}`}{" "}
        </Form.Label>
        {meal.isEmpty() ? (
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              console.log(e);
              plan.addMealFor(Days.Tuesday, draggedMeal);
            }}
          >
            Gericht hierhin ziehen
          </Box>
        ) : (
          meal.renderName()
        )}
      </Form.Field>
    );
  }
}
