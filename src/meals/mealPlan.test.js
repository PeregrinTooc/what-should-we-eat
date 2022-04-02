import { createEmptyMealPlan } from "./mealPlan";
import Days from "./Days.ts";
import { render, screen, act, cleanup } from "@testing-library/react";
import { mondayMealName, mondayMeal } from "./resources/testMeals";
import userEvent from "@testing-library/user-event";

let mealPlan;

beforeEach(() => {
  mealPlan = createEmptyMealPlan();
  expect(mealPlan).toBeDefined();
});

afterEach(() => {
  cleanup();
});
it("should be able to display itself", async () => {
  render(mealPlan.render());
  expect(screen.getByText("Essen für Montag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Dienstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Mittwoch")).toBeInTheDocument();
  expect(screen.getByText("Essen für Donnerstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Freitag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Samstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Sonntag")).toBeInTheDocument();
});

it("should display the name of the meal that was added", async () => {
  render(mealPlan.render());
  expect(screen.queryByText(mondayMealName)).not.toBeInTheDocument();
  addMondayMeal();
  expect(screen.getByText(mondayMealName)).toBeInTheDocument();
});

it("should have space for meals to be dropped on if no meal is planned for the day", async () => {
  render(mealPlan.render());
  expect(await screen.findAllByText("Gericht hierhin ziehen")).toHaveLength(7);
  addMondayMeal();
  expect(await screen.findAllByText("Gericht hierhin ziehen")).toHaveLength(6);
});

it("should be possible to delete a meal from the plan again using a button", async () => {
  render(mealPlan.render());
  expect(screen.queryByLabelText("delete")).not.toBeInTheDocument();
  addMondayMeal();
  const deleteButton = screen.getByLabelText("delete");
  await userEvent.click(deleteButton);
  expect(screen.queryByLabelText("delete")).not.toBeInTheDocument();
  expect(await screen.findAllByText("Gericht hierhin ziehen")).toHaveLength(7);
});
function addMondayMeal() {
  act(() => {
    mealPlan.addMealFor(Days.Monday, mondayMeal);
  });
}
