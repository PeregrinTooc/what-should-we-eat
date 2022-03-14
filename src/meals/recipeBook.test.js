import { createRecipeBookFromJson } from "./recipeBook";
import { render, screen } from "@testing-library/react";
import { mondayMeal, mondayMealName } from "./resources/testMeals";
it("should render itself", async () => {
  const recipeBook = createRecipeBookFromJson(JSON.stringify([mondayMeal]));
  expect(recipeBook).toBeDefined();
  render(recipeBook.render());
  expect(screen.getByText(mondayMealName)).toBeInTheDocument();
});
