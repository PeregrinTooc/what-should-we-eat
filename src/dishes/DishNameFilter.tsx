import React, { useState } from "react";
import { Filter, CompoundFilter } from "../utils/Filter";
import { Publisher, defaultPublisher } from "../utils/useSubscriber.ts";
import { Dish, DishNameFormat } from "./Dish.tsx";

class DishNameFilter implements Filter {
  compoundFilter: CompoundFilter;
  value: string = "";
  constructor(compoundFilter: CompoundFilter) {
    this.compoundFilter = compoundFilter;
  }
  toMatchContain(value: string) {
    this.value = value.toLowerCase();
    this.compoundFilter.compositeHasChanged();
  }
  matches(dishName: string): boolean {
    return dishName.toLowerCase().indexOf(this.value) > -1;
  }
  render() {
    return (
      <DishFilterBarName toMatchContain={this.toMatchContain.bind(this)} />
    );
  }
}
class DishFilter implements CompoundFilter, Publisher {
  dishNameFormat = new DishNameFormat();
  compositeHasChanged(): void {
    this.publish(this);
  }
  observers: Function[] = [];
  subscribe = defaultPublisher.subscribe.bind(this);
  unsubscribe = defaultPublisher.unsubscribe.bind(this);
  publish = defaultPublisher.publish.bind(this);
  dishNameFilter = new DishNameFilter(this);
  addFilterForName(): DishNameFilter {
    return this.dishNameFilter;
  }

  matches(dish: Dish): boolean {
    dish.export(this.dishNameFormat);
    return this.dishNameFilter.matches(this.dishNameFormat.dishName);
  }
  render() {
    return <>{this.dishNameFilter.render()}</>;
  }
}

export function createDishFilterObject(): Filter {
  return new DishFilter();
}

function DishFilterBarName({ toMatchContain }) {
  const [dishName, setDishName] = useState("");
  return (
    <div className="field">
      <label className="label">Name</label>
      <div className="control">
        <input
          className="input"
          value={dishName}
          type="text"
          onChange={(e) => {
            setDishName(e.target.value);
            toMatchContain(e.target.value);
          }}
        ></input>
      </div>
    </div>
  );
}
