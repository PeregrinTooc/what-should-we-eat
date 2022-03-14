import { render } from "@testing-library/react";
import { mondayMeal } from "./resources/testMeals";

it("should render as a modal", () => {
  console.log(mondayMeal);
  render(mondayMeal.renderAsModal());
});
