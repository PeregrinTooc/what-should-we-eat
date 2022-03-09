import { init, createMealPlan, createMeals } from "./index.js";
const testServer = require("../testServer.js");
const filePath = "";
const baseURI = "http://localhost:8000";
let mealsHandler;
let mealPlan;
let meals;

beforeEach(async () => {
  testServer.start();
  await init(baseURI, filePath);

  mealPlan = createMealPlan();
  meals = createMeals();
});

afterEach(async () => {
  await testServer.stop();
});

test("after init, meals and mealPlan should be defined", () => {
  expect(meals).toBeDefined();
  expect(mealPlan).toBeDefined();
});

test("Meal Plans should have a function getMealFor", () => {
  mealPlan.addMealFor("Monday", { mealName: "S" });
  expect(mealPlan.getMealFor("Monday")).toEqual({ mealName: "S" });
  mealPlan.addMealFor("Monday", { mealName: "T" });
  expect(mealPlan.getMealFor("Monday")).toEqual({ mealName: "T" });
  mealPlan.addMealFor("Tuesday", { mealName: "S" });
  expect(mealPlan.getMealFor("Monday")).toEqual({ mealName: "T" });
});

test("Meal Plans should have a function getOverview", () => {
  expect(mealPlan.getOverview()).toEqual(Array(7).fill(""));
  mealPlan.addMealFor("mon", { mealName: "S" });
  expect(mealPlan.getOverview()).toEqual([...["S"], ...Array(6).fill("")]);
  mealPlan.addMealFor("tue", { mealName: "T" });
  mealPlan.addMealFor("wed", { mealName: "U" });
  mealPlan.addMealFor("thu", { mealName: "V" });
  mealPlan.addMealFor("fri", { mealName: "W" });
  mealPlan.addMealFor("sat", { mealName: "X" });
  mealPlan.addMealFor("sun", { mealName: "Y" });
  expect(mealPlan.getOverview()).toEqual(["S", "T", "U", "V", "W", "X", "Y"]);
});

test("meals should be able to update themselves", () => {
  console.log(meals);
  let meal = { ...meals._meals[0] };
  console.log(meal);
  meal.effort = 4;
  meal.healthLevel = 8;
  meal.tags = ["Ofen", ...meal.tags];
  meals.modifyMeal(meal);
  expect(meals._meals[0]).toEqual(meal);
  expect(meals._meals).toHaveLength(1);
});
