import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Box, Button, Form } from "react-bulma-components";
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
  removeMealFor(day: Days);
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
  subscribe: Function = (updateState: Function) => {
    if (this.observers.indexOf(updateState) === -1) {
      this.observers.push(updateState);
    }
  };
  unsubscribe: Function = (updateState: Function) => {
    this.observers = this.observers.filter((f) => {
      return f !== updateState;
    });
  };
  removeMealFor = (day: Days) => {
    this.addMealFor(day, createEmptyMeal());
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
  useEffect(() => {
    mealPlan.subscribe(setState);
    return function cleanup() {
      mealPlan.unsubscribe(setState);
    };
  }, [mealPlan]);
  return (
    <>
      <MealPlanDayComonent day={mon} meal={state.monMeal} mealplan={this} />
      <MealPlanDayComonent day={tue} meal={state.tueMeal} mealplan={this} />
      <MealPlanDayComonent day={wed} meal={state.wedMeal} mealplan={this} />
      <MealPlanDayComonent day={thu} meal={state.thuMeal} mealplan={this} />
      <MealPlanDayComonent day={fri} meal={state.friMeal} mealplan={this} />
      <MealPlanDayComonent day={sat} meal={state.satMeal} mealplan={this} />
      <MealPlanDayComonent day={sun} meal={state.sunMeal} mealplan={this} />
    </>
  );
  function MealPlanDayComonent({ day, meal, mealplan }) {
    const [plan, setMealPlan] = useState(mealPlan);
    useEffect(() => {
      mealPlan.subscribe(setMealPlan);
      return function cleanup() {
        mealPlan.unsubscribe(setMealPlan);
      };
    }, []);
    return (
      <Form.Field key={day.id}>
        <Form.Label htmlFor={`dayNameForm-${day.id}`}>
          {`Essen für ${day.displayName}`}{" "}
        </Form.Label>
        {meal.isEmpty() ? (
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              plan.addMealFor(day.id, draggedMeal);
            }}
          >
            Gericht hierhin ziehen
          </Box>
        ) : (
          <Box>
            <div className="media">
              <div className="media-content">{meal.renderName()}</div>
              <div className="media-right">
                <Button
                  aria-label="delete"
                  remove={true}
                  onClick={() => {
                    plan.removeMealFor(day.id);
                  }}
                ></Button>
              </div>
            </div>
          </Box>
        )}
      </Form.Field>
    );
  }
}
