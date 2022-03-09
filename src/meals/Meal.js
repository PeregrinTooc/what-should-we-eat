import MealsTable from "./MealsTable";

class Meal {
  constructor(meal) {
    this.mealName = meal.mealName;
    this.effort = meal.effort;
    this.tags = [...meal.tags];
    this.healthLevel = meal.healthLevel;
  }
}
export class Meals {
  constructor(meals) {
    this._meals = meals.map((m) => new Meal(m));
  }

  renderAsTable(mealPlanControl) {
    return <MealsTable {...mealPlanControl} mealHandler={this} />;
  }
  modifyMeal(meal) {
    this._meals = this._meals.map((m) => {
      if (m.mealName === meal.mealName) {
        return meal;
      }
      return m;
    });
  }
}
