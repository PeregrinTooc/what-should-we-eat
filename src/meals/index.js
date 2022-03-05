import MealsTable from "./MealsTable";
const axios = require("axios");
const { Buffer } = require("buffer");
async function init(baseURI, mealsFilePath) {
  if (typeof process != "undefined") {
    axios.defaults.adapter = require("axios/lib/adapters/http");
  }
  const rpc = axios.create({
    baseURL: baseURI,
  });
  const jsonArray = await rpc.get(mealsFilePath);
  let encodedData = jsonArray.data.content;
  const buffer = Buffer.from(encodedData, "base64");
  const meals = buffer.toString();
  return new Meals(JSON.parse(meals).meals);
}

function createMealPlan() {
  return new MealPlan();
}

class MealPlan {
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

class Meal {
  constructor(meal) {
    this.mealName = meal.mealName;
    this.effort = meal.effort;
    this.tags = [...meal.tags];
    this.healthLevel = meal.healthLevel;
  }
}
class Meals {
  constructor(meals) {
    this._meals = meals.map((m) => new Meal(m));
  }
  getAllMeals() {
    return this._meals;
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

export { init, createMealPlan, Meals };
