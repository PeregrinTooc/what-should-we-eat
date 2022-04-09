import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Box, Button, Form } from "react-bulma-components";
import { createEmptyMeal, Meal, MealNameFormat } from "./../meals/meal.tsx";
import chef from "./../chef.ts";
import {
  useSubscriber,
  Publisher,
  defaultPublisher,
} from "../utils/useSubscriber.ts";
import Days, { mon, tue, wed, thu, fri, sat, sun } from "../utils/days.ts";

export interface MealPlan {
  addMealFor(day: Days, meal: Meal): void;
  render(): JSX.Element;
  removeMealFor(day: Days): void;
}

export function createEmptyMealPlan(): MealPlan {
  return new MealPlanImpl();
}

class MealPlanImpl implements MealPlan, Publisher {
  meals: Map<Days, Meal> = new Map([
    [mon.id, createEmptyMeal()],
    [tue.id, createEmptyMeal()],
    [wed.id, createEmptyMeal()],
    [thu.id, createEmptyMeal()],
    [fri.id, createEmptyMeal()],
    [sat.id, createEmptyMeal()],
    [sun.id, createEmptyMeal()],
  ]);

  observers: Function[] = [];
  subscribe = defaultPublisher.subscribe.bind(this);
  unsubscribe = defaultPublisher.unsubscribe.bind(this);
  publish = defaultPublisher.publish.bind(this);

  removeMealFor = (day: Days) => {
    this.addMealFor(day, createEmptyMeal());
  };
  addMealFor(day: Days, meal: Meal) {
    this.meals.set(day, meal);
    this.publish();
  }
  render() {
    return <MealPlanComponent mealPlan={this} />;
  }
}

function MealPlanComponent({ mealPlan }) {
  return (
    <>
      <MealPlanDayComponent day={mon} mealPlan={mealPlan} />
      <MealPlanDayComponent day={tue} mealPlan={mealPlan} />
      <MealPlanDayComponent day={wed} mealPlan={mealPlan} />
      <MealPlanDayComponent day={thu} mealPlan={mealPlan} />
      <MealPlanDayComponent day={fri} mealPlan={mealPlan} />
      <MealPlanDayComponent day={sat} mealPlan={mealPlan} />
      <MealPlanDayComponent day={sun} mealPlan={mealPlan} />
    </>
  );
  function MealPlanDayComponent({ day, mealPlan }) {
    const [meal, setState] = useState(mealPlan.meals.get(day.id));
    const observer = (mealPlan: MealPlanImpl) => {
      setState(mealPlan.meals.get(day.id));
    };
    const props = { mealPlan: mealPlan, meal: meal, dayId: day.id };
    useSubscriber(mealPlan, observer);
    return (
      <Form.Field key={day.id}>
        <Form.Label htmlFor={`dayNameForm-${day.id}`}>
          {`Essen für ${day.displayName}`}{" "}
        </Form.Label>
        {meal.isEmpty() ? (
          <EmptyMealSlot {...props} />
        ) : (
          <FilledMealSlot {...props} />
        )}
      </Form.Field>
    );
  }
}

function EmptyMealSlot({ mealPlan, dayId }) {
  return (
    <Box
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        chef.addPickedMealForDayToMealPlan(dayId, mealPlan);
      }}
    >
      Gericht hierhin ziehen
    </Box>
  );
}

function FilledMealSlot({ meal, mealPlan, dayId }) {
  const mealNameformat = new MealNameFormat();
  meal.export(mealNameformat);
  return (
    <Box>
      <div className="media">
        <div className="media-content">{mealNameformat.render()}</div>
        <div className="media-right">
          <Button
            aria-label="delete"
            remove={true}
            onClick={() => {
              mealPlan.removeMealFor(dayId);
            }}
          ></Button>
        </div>
      </div>
    </Box>
  );
}
