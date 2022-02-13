import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MealsTable from "./MealOverviewTable";
import { mealPlanController } from "../App.test";

it("removes selected option and adds it again after another option is selected", async () => {
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

it("doesn't allow deselection if not selected", async () => {
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

it("renders table headers", async () => {
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
it("renders table content", async () => {
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
