import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mondayMeal, mondayMealName } from "./resources/testMeals";

it("should render as a modal", async () => {
  mondayMeal.tags.push("Ofen");
  render(mondayMeal.renderDetails());
  expect(screen.queryByText(mondayMealName)).not.toBeInTheDocument();
  act(() => mondayMeal.showDetailScreen());
  expect(screen.getByText(mondayMealName)).toBeInTheDocument();
  expect(screen.getByText("Kartoffeln")).toBeInTheDocument();
  expect(screen.getByText("Ofen")).toBeInTheDocument();
  expect(screen.getByText("Aufwand: 3/10")).toBeInTheDocument();
  expect(screen.getByText("Gesundheitslevel: 7/10")).toBeInTheDocument();
  const closeButton = screen.getByLabelText("close");
  await userEvent.click(closeButton);
  expect(screen.queryByText(mondayMealName)).not.toBeInTheDocument();
});
