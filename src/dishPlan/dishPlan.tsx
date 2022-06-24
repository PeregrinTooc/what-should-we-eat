import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import { Box, Button, Form } from "react-bulma-components";
import {
  createEmptyDish,
  Dish,
  DishNameFormat,
  createDishWithProperties,
} from "./../dishes/Dish.tsx";
import chef from "./../chef.ts";
import {
  useSubscriber,
  Publisher,
  defaultPublisher,
} from "../utils/useSubscriber.ts";
import Days, { mon, tue, wed, thu, fri, sat, sun } from "../utils/days.ts";

export interface DishPlan {
  addDishFor(day: Days, dish: Dish): void;
  exportDishesToJSON(): string;
  render(): JSX.Element;
  removeDishFor(day: Days): void;
}

export function createEmptyDishPlan(): DishPlan {
  return new DishPlanImpl();
}

export function createDishPlanFromJSON(dishJSON: string): DishPlan {
  const result = new DishPlanImpl();
  let dishes = JSON.parse(dishJSON).map((dish) =>
    createDishWithProperties(dish)
  );
  result.dishes = new Map([
    [mon.id, dishes[0]],
    [tue.id, dishes[1]],
    [wed.id, dishes[2]],
    [thu.id, dishes[3]],
    [fri.id, dishes[4]],
    [sat.id, dishes[5]],
    [sun.id, dishes[6]],
  ]);
  return result;
}

class DishPlanImpl implements DishPlan, Publisher {
  dishes: Map<Days, Dish> = new Map([
    [mon.id, createEmptyDish()],
    [tue.id, createEmptyDish()],
    [wed.id, createEmptyDish()],
    [thu.id, createEmptyDish()],
    [fri.id, createEmptyDish()],
    [sat.id, createEmptyDish()],
    [sun.id, createEmptyDish()],
  ]);

  observers: Function[] = [];
  subscribe = defaultPublisher.subscribe.bind(this);
  unsubscribe = defaultPublisher.unsubscribe.bind(this);
  publish = defaultPublisher.publish.bind(this);
  exportDishesToJSON(): string {
    let dishes = [];
    this.dishes.forEach((dish) => {
      dishes.push(dish);
    });
    return JSON.stringify(dishes);
  }
  removeDishFor = (day: Days) => {
    this.addDishFor(day, createEmptyDish());
  };
  addDishFor(day: Days, dish: Dish) {
    this.dishes.set(day, dish);
    this.publish();
  }
  render() {
    return <DishPlanComponent dishPlan={this} />;
  }
}

function DishPlanComponent({ dishPlan }) {
  return (
    <>
      <DishPlanDayComponent day={mon} dishPlan={dishPlan} />
      <DishPlanDayComponent day={tue} dishPlan={dishPlan} />
      <DishPlanDayComponent day={wed} dishPlan={dishPlan} />
      <DishPlanDayComponent day={thu} dishPlan={dishPlan} />
      <DishPlanDayComponent day={fri} dishPlan={dishPlan} />
      <DishPlanDayComponent day={sat} dishPlan={dishPlan} />
      <DishPlanDayComponent day={sun} dishPlan={dishPlan} />
    </>
  );
  function DishPlanDayComponent({ day, dishPlan }) {
    const [dish, setState] = useState(dishPlan.dishes.get(day.id));
    const observer = (dishPlan: DishPlanImpl) => {
      setState(dishPlan.dishes.get(day.id));
    };
    const props = { dishPlan: dishPlan, dish: dish, dayId: day.id };
    useSubscriber(dishPlan, observer);
    return (
      <Form.Field key={day.id}>
        <Form.Label htmlFor={`dayNameForm-${day.id}`}>
          {`Essen für ${day.displayName}`}{" "}
        </Form.Label>
        {dish.isEmpty() ? (
          <EmptyDishSlot {...props} />
        ) : (
          <FilledDishSlot {...props} />
        )}
      </Form.Field>
    );
  }
}

function EmptyDishSlot({ dishPlan, dayId }) {
  return (
    <Box
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        chef.addPickedDishForDayToDishPlan(dayId, dishPlan);
      }}
    >
      Gericht hierhin ziehen
    </Box>
  );
}

function FilledDishSlot({ dish, dishPlan, dayId }) {
  const dishNameformat = new DishNameFormat();
  dish.export(dishNameformat);
  return (
    <Box>
      <div className="media">
        <div className="media-content">{dishNameformat.render()}</div>
        <div className="media-right">
          <Button
            aria-label="delete"
            remove={true}
            onClick={() => {
              dishPlan.removeDishFor(dayId);
            }}
          ></Button>
        </div>
      </div>
    </Box>
  );
}
