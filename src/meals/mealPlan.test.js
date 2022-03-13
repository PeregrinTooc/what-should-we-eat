import { createEmptyMealPlan, Days } from "./mealPlan";
import { createMealFromJSON } from "./meal";
import { render, screen, act } from "@testing-library/react";

let mealPlan;

beforeEach(() => {
  mealPlan = createEmptyMealPlan();
  expect(mealPlan).toBeDefined();
});
const mondayMealName = "Ofengemüse mit Kartoffeln und Tzatziki";
const mondayMeal = createMealFromJSON(
  JSON.stringify({
    mealName: mondayMealName,
    effort: 3,
    tags: ["Kartoffeln"],
    healthLevel: 7,
  })
);

it("should be able to display itself", async () => {
  await render(mealPlan.render());
  expect(screen.getByText("Essen für Montag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Dienstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Mittwoch")).toBeInTheDocument();
  expect(screen.getByText("Essen für Donnerstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Freitag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Samstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Sonntag")).toBeInTheDocument();
});

it("should display the name of the meal that was added", async () => {
  await render(mealPlan.render());
  expect(screen.queryByText(mondayMealName)).not.toBeInTheDocument();
  act(() => {
    mealPlan.addMealFor(Days.Monday, mondayMeal);
  });
  expect(screen.getByText(mondayMealName)).toBeInTheDocument();
});
