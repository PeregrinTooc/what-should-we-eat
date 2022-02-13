import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Mealplan from "./MealPlan";
import { mealPlanController } from "./../App.test";

it("renders meal plan and offers download button", async () => {
  const mealPlan = ["Foo", "Bar", "Com", "Bat", "X", "Y", "Z"];
  render(
    <Mealplan
      mealPlanController={mealPlanController}
      updateMealPlan={() => {}}
      saveAsImage={(element) => {
        expect(element.childNodes).toHaveLength(7);
      }}
      mealPlan={mealPlan}
    />
  );
  mealPlan.forEach(async (meal) => {
    await screen.findByText(meal);
  });
  const button = await screen.findByRole("button");
  expect(button.textContent).toBe("Als Bild Speichern");
  userEvent.click(button);
});
