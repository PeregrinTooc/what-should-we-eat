const axios = require("axios");
const { Buffer } = require("buffer");
async function init(baseURI, mealsFilePath) {
  if (typeof process != "undefined") {
    axios.defaults.adapter = require("axios/lib/adapters/http");
  }
  const path = baseURI + mealsFilePath;
  const rpc = axios.create({
    baseURL: baseURI,
  });
  const jsonArray = await rpc.get(mealsFilePath);
  let encodedData = jsonArray.data.content;
  const buffer = Buffer.from(encodedData, "base64");
  const meals = buffer.toString();
  return new MealsHandler(JSON.parse(meals).meals);
}

function getMealPlan() {
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
}

class MealsHandler {
  constructor(meals) {
    this._meals = meals;
  }
  getAllMeals() {
    return this._meals;
  }
}

//export { init, getMealPlan }
module.exports = { init, getMealPlan };
