import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mondayMeal, mondayMealName } from "./resources/testMeals";

it("should render as a modal", async () => {
  render(mondayMeal.renderDetails());
  expect(screen.queryByText(mondayMealName)).not.toBeInTheDocument();
  act(() => mondayMeal.showDetailScreen());
  expect(await screen.findByText(mondayMealName)).toBeInTheDocument();
  const closeButton = await screen.findByLabelText("close");
  await userEvent.click(closeButton);
  expect(screen.queryByText(mondayMealName)).not.toBeInTheDocument();
});
