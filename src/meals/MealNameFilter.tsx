import React, { useState } from "react";
import { Filter, CompoundFilter } from "../utils/Filter";
import { Publisher, defaultPublisher } from "../utils/useSubscriber.ts";
import { Meal, MealNameFormat } from "./meal.tsx";

class MealNameFilter implements Filter {
  compoundFilter: CompoundFilter;
  value: string = "";
  constructor(compoundFilter: CompoundFilter) {
    this.compoundFilter = compoundFilter;
  }
  toMatchContain(value: string) {
    this.value = value.toLowerCase();
    this.compoundFilter.compositeHasChanged();
  }
  matches(mealName: string): boolean {
    return mealName.toLowerCase().indexOf(this.value) > -1;
  }
  render() {
    return (
      <MealFilterBarName toMatchContain={this.toMatchContain.bind(this)} />
    );
  }
}
class MealFilter implements CompoundFilter, Publisher {
  mealNameFormat = new MealNameFormat();
  compositeHasChanged(): void {
    this.publish(this);
  }
  observers: Function[] = [];
  subscribe = defaultPublisher.subscribe.bind(this);
  unsubscribe = defaultPublisher.unsubscribe.bind(this);
  publish = defaultPublisher.publish.bind(this);
  mealNameFilter = new MealNameFilter(this);
  addFilterForName(): MealNameFilter {
    return this.mealNameFilter;
  }

  matches(meal: Meal): boolean {
    meal.export(this.mealNameFormat);
    return this.mealNameFilter.matches(this.mealNameFormat.mealName);
  }
  render() {
    return <>{this.mealNameFilter.render()}</>;
  }
}

export function createMealFilterObject(): Filter {
  return new MealFilter();
}

function MealFilterBarName({ toMatchContain }) {
  const [mealName, setMealName] = useState("");
  return (
    <div className="field">
      <label className="label">Name</label>
      <div className="control">
        <input
          className="input"
          value={mealName}
          type="text"
          onChange={(e) => {
            setMealName(e.target.value);
            toMatchContain(e.target.value);
          }}
        ></input>
      </div>
    </div>
  );
}
