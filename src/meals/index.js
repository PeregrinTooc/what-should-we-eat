import { Meals } from "./Meal";
import { MealPlan } from "./MealPlan";
const axios = require("axios");
const { Buffer } = require("buffer");
let meals;
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
  const mealsData = buffer.toString();
  meals = new Meals(JSON.parse(mealsData).meals);
}

function createMeals() {
  return meals;
}
function createMealPlan() {
  return new MealPlan();
}

export { init, createMealPlan, createMeals };
