import { createEmptyMealPlan, Days } from "./mealPlan";
import { createMealFromJSON } from "./meal";
import { render } from "@testing-library/react";

let mealPlan;

beforeEach(() => {
  mealPlan = createEmptyMealPlan();
  expect(mealPlan).toBeDefined();
});
it("should be possible to add a meal", () => {
  mealPlan.addMealFor(
    Days.Monday,
    createMealFromJSON(
      JSON.stringify({
        mealName: "Ofengemüse mit Kartoffeln und Tzatziki",
        effort: 3,
        tags: ["Kartoffeln"],
        healthLevel: 7,
      })
    )
  );
});

it("should be able to display itself", async () => {
  await render(mealPlan.render());
});
