import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import MealsTable from "./components/MealOverviewTable";

const mealPlanController = require("./meals/index.js").getMealPlan();
const testServer = require("./testServer");
const port = 8002;
const baseURI = `http://localhost:${port}`;
beforeAll(async () => {
  testServer.start(port);
});

afterEach(() => {
  cleanup();
});
afterAll(async () => {
  await testServer.stop();
});

test("updates form, removes selected option and adds it again after deselection", async () => {
  render(<App baseURI={baseURI} />);
  const mealName = "Ofengemüse mit Kartoffeln und Tzatziki";
  const selectOptionRoleName = mealName.split(` `).join("_");
  await screen.findByText(mealName);
  userEvent.selectOptions(screen.getByRole(selectOptionRoleName), "mon");
  expect(screen.getByLabelText("Essen für Montag")).toHaveDisplayValue(
    mealName
  );
  expect(screen.getByRole(selectOptionRoleName)).toHaveLength(8);
  expect(await screen.findByText("geplant für Montag")).toBeDefined();
  userEvent.selectOptions(screen.getByRole(selectOptionRoleName), "del");
  expect(screen.getByRole(selectOptionRoleName)).toHaveLength(9);
  userEvent.selectOptions(screen.getByRole(selectOptionRoleName), "mon");
});

test("removes selected option and adds it again after another option is selected", async () => {
  render(
    <MealsTable
      availableMeals={[
        {
          mealName: "Foo",
          effort: "3",
          tags: "Kartoffeln",
          helthLevel: "7",
        },
      ]}
      mealPlanController={mealPlanController}
      updateMealPlan={() => {}}
    />
  );
  await screen.findByText("Foo");
  userEvent.selectOptions(screen.getByRole("Foo"), "mon");
  userEvent.selectOptions(screen.getByRole("Foo"), "tue");
  userEvent.selectOptions(screen.getByRole("Foo"), "mon");
});

test("doesn't allow deselection if not selected", async () => {
  render(
    <MealsTable
      availableMeals={[
        {
          mealName: "Foo",
          effort: "3",
          tags: "Kartoffeln",
          helthLevel: "7",
        },
        {
          mealName: "Bar",
          effort: "3",
          tags: "Kartoffeln",
          helthLevel: "7",
        },
      ]}
      mealPlanController={mealPlanController}
      updateMealPlan={() => {}}
    />
  );
  await screen.findByText("Foo");
  await screen.findByText("Bar");
  userEvent.selectOptions(screen.getByRole("Foo"), "del");
  expect(screen.getByRole("Foo")).toHaveLength(9);
});

test("renders table and form", async () => {
  render(<App baseURI={baseURI} />);
  await screen.findByText("Ofengemüse mit Kartoffeln und Tzatziki");
  await screen.findByLabelText("Essen für Montag");
  await screen.findByLabelText("Essen für Dienstag");
  await screen.findByLabelText("Essen für Mittwoch");
  await screen.findByLabelText("Essen für Donnerstag");
  await screen.findByLabelText("Essen für Freitag");
  await screen.findByLabelText("Essen für Samstag");
  await screen.findByLabelText("Essen für Sonntag");
});

test("renders table headers", async () => {
  render(
    <MealsTable
      availableMeals={[]}
      mealPlanController={mealPlanController}
      updateMealPlan={() => {}}
    />
  );
  await screen.findByText("Name");
  await screen.findByText("Aufwand");
  await screen.findByText("Kategorien");
  await screen.findByText("geplant für");
  await screen.findByText("wähle einen Tag");
});

test("renders table content", async () => {
  render(
    <MealsTable
      availableMeals={[
        {
          mealName: "Ofengemüse mit Kartoffeln und Tzatziki",
          effort: "3",
          tags: "Kartoffeln",
          helthLevel: "7",
        },
      ]}
      mealPlanController={mealPlanController}
      updateMealPlan={() => {}}
    />
  );
  await screen.findByText("3");
  await screen.findByText("Ofengemüse mit Kartoffeln und Tzatziki");
  await screen.findByText("Kartoffeln");
});
