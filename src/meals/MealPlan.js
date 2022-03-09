export class MealPlan {
  constructor() {
    this._meals = new Map();
  }
  addMealFor(day, meal) {
    this._meals.set(day, meal);
  }
  getMealFor(day) {
    return this._meals.get(day);
  }
  getOverview() {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    let result = [];
    days.forEach((day) => {
      let meal = this.getMealFor(day);
      if (meal) {
        result.push(meal.mealName);
      } else {
        result.push("");
      }
    });
    return result;
  }
}
