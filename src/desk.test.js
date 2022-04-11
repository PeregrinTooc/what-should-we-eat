import createDesk from "./desk.tsx";
import { render, screen } from "@testing-library/react";

let dishPlanRendered, recipeBookRendered;
const dishPlanDouble = {
  render: () => {
    dishPlanRendered = true;
  },
};
const recipeBookDouble = {
  render: () => {
    recipeBookRendered = true;
  },
};

beforeEach(() => {
  dishPlanRendered = false;
  recipeBookRendered = false;
});

it("should render the dishPlan and the recipeBook", () => {
  render(createDesk(dishPlanDouble, recipeBookDouble).render());
  expect(dishPlanRendered && recipeBookRendered).toBe(true);
});

it('should render the button with text "Als Bild Speichern"', () => {
  render(createDesk(dishPlanDouble, recipeBookDouble).render());
  const button = screen.getByRole("button");
  expect(button.textContent).toBe("Als Bild Speichern");
});

it('should render the heading with text "Was wollen wir essen?"', () => {
  render(createDesk(dishPlanDouble, recipeBookDouble).render());
  const button = screen.getByRole("heading");
  expect(button.textContent).toBe("Was wollen wir essen?");
});
