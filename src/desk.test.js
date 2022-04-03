import createDesk from "./desk.tsx";
import { render, screen } from "@testing-library/react";

let mealPlanRendered, recipeBookRendered;
const mealPlanDouble = {
  render: () => {
    mealPlanRendered = true;
  },
};
const recipeBookDouble = {
  render: () => {
    recipeBookRendered = true;
  },
};

beforeEach(() => {
  mealPlanRendered = false;
  recipeBookRendered = false;
});

it("should render the mealPlan and the recipeBook", () => {
  render(createDesk(mealPlanDouble, recipeBookDouble).render());
  expect(mealPlanRendered && recipeBookRendered).toBe(true);
});

it('should render the button with text "Als Bild Speichern"', () => {
  render(createDesk(mealPlanDouble, recipeBookDouble).render());
  const button = screen.getByRole("button");
  expect(button.textContent).toBe("Als Bild Speichern");
});

it('should render the heading with text "Was wollen wir essen?"', () => {
  render(createDesk(mealPlanDouble, recipeBookDouble).render());
  const button = screen.getByRole("heading");
  expect(button.textContent).toBe("Was wollen wir essen?");
});
