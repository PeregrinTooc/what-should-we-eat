import { init, getMealPlan } from "./index.js";
const testServer = require("../testServer.js");
const baseURI = "http://localhost:8000";
let mealsHandler;
let mealPlan;
let meals;

beforeEach(async () => {
  testServer.start();
  mealsHandler = await init(baseURI);
  mealPlan = getMealPlan();
  meals = mealsHandler.getAllMeals();
});

afterEach(async () => {
  await testServer.stop();
});

test("init should return an object with a method getAllMeals", () => {
  expect(mealsHandler).toBeDefined();
  expect(mealsHandler.getAllMeals).toBeDefined();
});

test("getAllMeals should return an array of meals", () => {
  expect(meals).toBeDefined();
  expect(meals[0]).toEqual({
    mealName: "Ofengemüse mit Kartoffeln und Tzatziki",
    effort: "3",
    tags: "Kartoffeln",
    helthLevel: "7",
  });
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
