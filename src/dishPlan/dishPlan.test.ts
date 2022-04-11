import { createEmptyDishPlan } from "./dishPlan";
import Days from "../utils/days";
import { render, screen, act, cleanup } from "@testing-library/react";
import { mondayDishName, mondayDish } from "../dishes/resources/testDishes";
import userEvent from "@testing-library/user-event";

let dishPlan;

beforeEach(() => {
  dishPlan = createEmptyDishPlan();
  expect(dishPlan).toBeDefined();
});

afterEach(() => {
  cleanup();
});
it("should be able to display itself", async () => {
  render(dishPlan.render());
  expect(screen.getByText("Essen für Montag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Dienstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Mittwoch")).toBeInTheDocument();
  expect(screen.getByText("Essen für Donnerstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Freitag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Samstag")).toBeInTheDocument();
  expect(screen.getByText("Essen für Sonntag")).toBeInTheDocument();
});

it("should display the name of the dish that was added", async () => {
  render(dishPlan.render());
  expect(screen.queryByText(mondayDishName)).not.toBeInTheDocument();
  addMondayDish();
  expect(screen.getByText(mondayDishName)).toBeInTheDocument();
});

it("should have space for dishes to be dropped on if no dish is planned for the day", async () => {
  render(dishPlan.render());
  expect(await screen.findAllByText("Gericht hierhin ziehen")).toHaveLength(7);
  addMondayDish();
  expect(await screen.findAllByText("Gericht hierhin ziehen")).toHaveLength(6);
});

it("should be possible to delete a dish from the plan again using a button", async () => {
  render(dishPlan.render());
  expect(screen.queryByLabelText("delete")).not.toBeInTheDocument();
  addMondayDish();
  const deleteButton = screen.getByLabelText("delete");
  await userEvent.click(deleteButton);
  expect(screen.queryByLabelText("delete")).not.toBeInTheDocument();
  expect(await screen.findAllByText("Gericht hierhin ziehen")).toHaveLength(7);
});
function addMondayDish() {
  act(() => {
    dishPlan.addDishFor(Days.Monday, mondayDish);
  });
}
