import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import MealsTable from "./components/MealOverviewTable";

const mealPlanController = require("./meals/index.js").getMealPlan();
const testServer = require("./testServer");
beforeAll(async () => {
  testServer.start(8001);
});

afterEach(() => {
  cleanup();
});
afterAll(async () => {
  await testServer.stop();
});

test("updates form", async () => {
  render(<App baseURI={"http://localhost:8001"} />);
  await screen.findByText("Ofengemüse mit Kartoffeln und Tzatziki");
  userEvent.selectOptions(screen.getByTestId("plannedFor"), "mon");
  expect(screen.getByLabelText("Essen für Montag")).toHaveDisplayValue(
    "Ofengemüse mit Kartoffeln und Tzatziki"
  );
});

test("renders table and form", async () => {
  render(<App baseURI={"http://localhost:8001"} />);
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
      data={[]}
      mealPlanController={mealPlanController}
      updateMealPlan={() => {}}
    />
  );
  await screen.findByText("Name");
  await screen.findByText("Aufwand");
  await screen.findByText("Kategorien");
  await screen.findByText("Geplant für");
});

test("renders table content", async () => {
  render(
    <MealsTable
      data={[
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
