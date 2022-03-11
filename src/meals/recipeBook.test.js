import { createRecipeBookFromJson } from "./recipeBook";

it("should initialize with a JSON string", () => {
  expect(createRecipeBookFromJson(JSON.stringify({}))).toBeDefined();
});
