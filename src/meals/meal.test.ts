import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mondayMeal, mondayMealName } from "./resources/testMeals";
import { createMealFilterObject } from "./MealNameFilter";
import { MealNameFormat, MealListItemFormat, MealModalFormat, createMealWithProperties } from './meal';

describe("tests for meal rendering", () => {
  it("should render as a modal", async () => {
    const format = new MealModalFormat()
    mondayMeal.export(format)
    render(format.render());
    expect(screen.queryByText(mondayMealName)).not.toBeInTheDocument();
    act(() => format.showDetailScreen());
    expect(screen.getByText(mondayMealName)).toBeInTheDocument();
    expect(screen.getByText("Kartoffeln")).toBeInTheDocument();
    expect(screen.getByText("Ofen")).toBeInTheDocument();
    expect(screen.getByText("Aufwand: 3/10")).toBeInTheDocument();
    expect(screen.getByText("Gesundheitslevel: 7/10")).toBeInTheDocument();
    const closeButton = screen.getByLabelText("close");
    await userEvent.click(closeButton);
    expect(screen.queryByText(mondayMealName)).not.toBeInTheDocument();
  });

  it("should render as a list item with a details button which opens the modal", async () => {
    const format = new MealListItemFormat(mondayMeal)
    mondayMeal.export(format)
    render(format.render());
    expect(screen.getByText(mondayMealName)).toBeInTheDocument();
    const detailsButton = screen.getByRole("button");
    expect(detailsButton).toHaveTextContent("Details");
    expect(screen.queryByLabelText("close")).not.toBeInTheDocument();
    userEvent.click(detailsButton);
    expect(screen.getByLabelText("close")).toBeInTheDocument();
  });
  it("should render its name", async () => {
    const format = new MealNameFormat();
    mondayMeal.export(format)
    render(format.render())
    expect(screen.getByText(mondayMealName)).toBeInTheDocument();
  });
});

describe("tests for meal filtering", () => {
  let filterObject;
  beforeEach(() => {
    filterObject = createMealFilterObject();
  });

  it.each([
    [mondayMealName, true],
    ["Gemüse", true],
    ["gemüse", true],
    ["", true],
    ["asdfgbssdfg", false],
  ])(
    "filters for name case-insensitive and matches empty strings",
    (input, expected) => {
      filterObject.addFilterForName().toMatchContain(input);
      expect(filterObject.matches(mondayMeal)).toEqual(expected);
    }
  );

  it("should render the filter bar", async () => {
    filterObject.addFilterForName().toMatchContain("");
    render(filterObject.render());
    expect(screen.queryByText(";")).not.toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("");
    userEvent.type(input, "Ofen");
    expect(input).toHaveValue("Ofen");
    userEvent.clear(input);
    expect(input).toHaveValue("");
    userEvent.type(input, "asdf");
    expect(filterObject.matches(mondayMeal)).toEqual(false);
    expect(filterObject.matches(createMealWithProperties({ mealName: "asdf" }))).toEqual(true);
  });

  it("should inform subscribers about changes", () => {
    let hasInformed = false;
    filterObject.addFilterForName().toMatchContain("");
    filterObject.subscribe((filterObject) => {
      hasInformed = true;
    });
    filterObject.addFilterForName().toMatchContain("asdd");
    expect(hasInformed).toBe(true);
  });
});
