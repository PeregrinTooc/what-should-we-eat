import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import MealsTable from "./MealOverviewTable";
import { mealPlanController } from "../App.test";

const minimalMeals = [
  {
    mealName: "Foo",
    effort: 3,
    tags: ["Kartoffeln"],
    helthLevel: 7,
  },
];

it("removes selected option and adds it again after another option is selected", async () => {
  renderTable(minimalMeals);
  await screen.findByText("Foo");
  userEvent.selectOptions(screen.getByRole("Foo"), "mon");
  userEvent.selectOptions(screen.getByRole("Foo"), "tue");
  userEvent.selectOptions(screen.getByRole("Foo"), "mon");
});

it("doesn't allow deselection if not selected", async () => {
  const availableMeals = [
    {
      mealName: "Bar",
      effort: 3,
      tags: ["Kartoffeln"],
      helthLevel: 7,
    },
    ...minimalMeals,
  ];
  renderTable(availableMeals);
  await screen.findByText("Foo");
  await screen.findByText("Bar");
  userEvent.selectOptions(screen.getByRole("Foo"), "del");
  expect(screen.getByRole("Foo")).toHaveLength(9);
});

it("renders table headers", async () => {
  renderEmptyTable();
  await screen.findByRole("columnheader", { name: "Name" });
  await screen.findByRole("columnheader", { name: "Aufwand" });
  await screen.findByRole("columnheader", { name: "Kategorien" });
  await screen.findByRole("columnheader", { name: "Geplant für" });
  await screen.findByRole("columnheader", { name: "Wähle einen Tag" });
});
it("renders table content", async () => {
  renderTable(minimalMeals);
  await screen.getByDisplayValue("3");
  await screen.findByText("Foo");
  await screen.findByText("Kartoffeln");
});

it("allows changing of effort", async () => {
  renderTable(minimalMeals);
  let effortInput = await screen.getByDisplayValue("3");
  userEvent.clear(effortInput);
  expect(screen.queryByDisplayValue(3)).not.toBeInTheDocument();
  userEvent.type(effortInput, "2");
  expect(screen.queryByDisplayValue("2")).toBeInTheDocument();
});

it("allows only empty or values between 1 and 10 for effort", async () => {
  renderTable(minimalMeals);
  let effortInput = await screen.getByDisplayValue("3");
  expect(effortInput).toHaveAttribute("placeHolder", "Werte zwischen 1 und 10");
  userEvent.clear(effortInput);
  userEvent.type(effortInput, "a");
  expect(screen.queryByDisplayValue("a")).not.toBeInTheDocument();
  userEvent.type(effortInput, "12");
  expect(screen.queryByDisplayValue("12")).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue("1")).toBeInTheDocument();
  userEvent.clear(effortInput);
  userEvent.type(effortInput, "0");
  expect(screen.queryByDisplayValue("0")).not.toBeInTheDocument();
});

it("renders a filter bar", async () => {
  renderEmptyTable();
  expect(screen.getByLabelText("Gesundheitslevel")).toBeDefined();
  expect(screen.getByLabelText("Aufwand")).toBeDefined();
  expect(screen.getByLabelText("Kategorien")).toBeDefined();
  expect(screen.getByLabelText("Name")).toBeDefined();
});

it("filters by values", async () => {
  renderTable(minimalMeals);
  expect(screen.getByText("Foo")).toBeDefined();
  const nameFilter = screen.getByLabelText("Name");
  const tagFilter = screen.getByLabelText("Kategorien");
  userEvent.type(nameFilter, "Bar");
  expect(screen.queryByText("Foo")).not.toBeInTheDocument();
  userEvent.clear(nameFilter);
  expect(screen.getByText("Foo")).toBeDefined();
  userEvent.type(tagFilter, "something");
  expect(screen.queryByText("Foo")).not.toBeInTheDocument();
});

it("filters meals by name case-tolerant by contains", async () => {
  renderTable(minimalMeals);
  const nameFilter = screen.getByLabelText("Name");
  userEvent.type(nameFilter, "o");
  expect(screen.getByText("Foo")).toBeDefined();
  userEvent.clear(nameFilter);
  userEvent.type(nameFilter, "O");
  expect(screen.getByText("Foo")).toBeDefined();
});

it("filters meals by tags case-tolerant by beginning", async () => {
  renderTable(minimalMeals);
  const tagFilter = screen.getByLabelText("Kategorien");
  userEvent.type(tagFilter, "K");
  expect(screen.getByText("Foo")).toBeDefined();
  userEvent.clear(tagFilter);
  userEvent.type(tagFilter, "k");
  expect(screen.getByText("Foo")).toBeDefined();
});

it("does not filter meals without tags", async () => {
  renderTable([
    {
      mealName: "Foo",
      effort: 3,
      tags: [],
      helthLevel: 7,
    },
  ]);
  expect(screen.getByText("Foo")).toBeDefined();
});

function renderEmptyTable() {
  renderTable([]);
}

function renderTable(availableMeals) {
  const MealsHandler = require("../../meals/index").MealsHandler;
  render(
    <MealsTable
      mealPlanController={mealPlanController}
      updateMealPlan={() => {}}
      mealHandler={new MealsHandler(availableMeals)}
    />
  );
}
