import { createRecipeBookFromJson } from "./recipeBook";
import { render, screen } from "@testing-library/react";
import { mondayMeal, mondayMealName } from "./resources/testMeals";
it("should render itself", async () => {
  let detailsRendered = false;
  const recipeBook = createRecipeBookFromJson(JSON.stringify([mondayMeal]));
  expect(recipeBook).toBeDefined();
  recipeBook.meals[0].renderDetails = () => {
    detailsRendered = true;
  };
  render(recipeBook.render());
  expect(screen.getByText(mondayMealName)).toBeInTheDocument();
  expect(detailsRendered).toBe(true);
});
