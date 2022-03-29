import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Box, Button, Form } from "react-bulma-components";
import { createEmptyMeal, Meal } from "./meal.tsx";
import { chef } from "./../chef.ts"
import { useSubscriber, Publisher, defaultPublisher } from "./useSubscriber.ts";

export enum Days {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}



const mon = { id: Days.Monday, displayName: "Montag" };
const tue = { id: Days.Tuesday, displayName: "Dienstag" };
const wed = { id: Days.Wednesday, displayName: "Mittwoch" };
const thu = { id: Days.Thursday, displayName: "Donnerstag" };
const fri = { id: Days.Friday, displayName: "Freitag" };
const sat = { id: Days.Saturday, displayName: "Samstag" };
const sun = { id: Days.Sunday, displayName: "Sonntag" };

export interface MealPlan {
  addMealFor(day: Days, meal: Meal): void;
  render(): JSX.Element;
  removeMealFor(day: Days): void;
}

export function createEmptyMealPlan(): MealPlan {
  return new MealPlanImpl();
}

class MealPlanImpl implements MealPlan, Publisher {
  monMeal: Meal = createEmptyMeal();
  tueMeal: Meal = createEmptyMeal();
  wedMeal: Meal = createEmptyMeal();
  thuMeal: Meal = createEmptyMeal();
  friMeal: Meal = createEmptyMeal();
  satMeal: Meal = createEmptyMeal();
  sunMeal: Meal = createEmptyMeal();

  observers: Function[] = [];
  subscribe = defaultPublisher.subscribe.bind(this);
  unsubscribe = defaultPublisher.unsubscribe.bind(this);
  publish = defaultPublisher.publish.bind(this);

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
    this.publish();
  }
  render() {
    return <MealPlanComponent mealPlan={this} />;
  }
}

function MealPlanComponent({ mealPlan }) {
  const [state, setState] = useState({
    ...mealPlan
  });
  const observer = (o) => {
    if (
      o.monMeal !== state.monMeal ||
      o.tueMeal !== state.tueMeal ||
      o.wedMeal !== state.wedMeal ||
      o.thuMeal !== state.thuMeal ||
      o.friMeal !== state.friMeal ||
      o.satMeal !== state.satMeal ||
      o.sunMeal !== state.sunMeal
    ) {
      setState({ ...o })
    }
  };

  useSubscriber(mealPlan, observer);

  return (
    <>
      <MealPlanDayComponent
        day={mon}
        meal={state.monMeal}
        mealPlan={mealPlan}
      />
      <MealPlanDayComponent
        day={tue}
        meal={state.tueMeal}
        mealPlan={mealPlan}
      />
      <MealPlanDayComponent
        day={wed}
        meal={state.wedMeal}
        mealPlan={mealPlan}
      />
      <MealPlanDayComponent
        day={thu}
        meal={state.thuMeal}
        mealPlan={mealPlan}
      />
      <MealPlanDayComponent
        day={fri}
        meal={state.friMeal}
        mealPlan={mealPlan}
      />
      <MealPlanDayComponent
        day={sat}
        meal={state.satMeal}
        mealPlan={mealPlan}
      />
      <MealPlanDayComponent
        day={sun}
        meal={state.sunMeal}
        mealPlan={mealPlan}
      />
    </>
  );
  function MealPlanDayComponent({ day, meal, mealPlan }) {
    return (
      <Form.Field key={day.id}>
        <Form.Label htmlFor={`dayNameForm-${day.id}`}>
          {`Essen für ${day.displayName}`}{" "}
        </Form.Label>
        {meal.isEmpty() ? (
          <Box
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              mealPlan.addMealFor(day.id, chef.getPickedMeal());
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
                    mealPlan.removeMealFor(day.id);
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
