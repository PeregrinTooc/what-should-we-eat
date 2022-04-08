import { createRecipeBookFromJson, createEmptyRecipeBook } from "./recipeBook";
import { render, screen } from "@testing-library/react";
import { mondayMeal } from "./resources/testMeals";
import userEvent from "@testing-library/user-event";
import { createMealWithProperties } from "./meal";

function assertNumberOfPaginationEllipsesIs(i) {
  const paginationEllipsis = "\u2026";
  if (i > 0) {
    expect(screen.getAllByText(paginationEllipsis)).toHaveLength(i);
  } else {
    expect(screen.queryByText(paginationEllipsis)).not.toBeInTheDocument();
  }
}

function assertPagesAreShown(pagesTexts) {
  const actualButtonTexts = screen
    .getAllByRole("button")
    .map((button) => button.textContent)
    .filter((text) => {
      return text !== "Nächste" && text !== "Vorherige";
    })
    .sort();
  let expectedButtonTexts = pagesTexts.sort();
  expect(actualButtonTexts).toEqual(expectedButtonTexts);
}

function prepareWithMealsAndRender(numberOfMeals) {
  const recipeBook = createEmptyRecipeBook();
  for (let i = 0; i < numberOfMeals; i++) {
    const mealName = `Meal Number ${i}`;
    recipeBook.add({
      mealName: mealName,
      renderAsListItemWithDetailsButton: () => {
        return <p>{mealName}</p>;
      },
    });
  }
  render(recipeBook.render());
}

it("should be possible to add meals to the book", () => {
  const recipeBook = createEmptyRecipeBook();
  recipeBook.add(mondayMeal);
});

it("should be possible to create a recipebook from JSON", () => {
  const recipeBook = createRecipeBookFromJson(
    JSON.stringify({ meals: [mondayMeal] })
  );
  expect(recipeBook).toBeDefined();
});
it("should render itself and delegate rendering of its contents to the meals", () => {
  let renderedAsListItem = false;
  mondayMeal.renderAsListItemWithDetailsButton = (f) => {
    renderedAsListItem = true;
  };
  const recipeBook = createEmptyRecipeBook();
  recipeBook.add(mondayMeal);
  render(recipeBook.render());
  expect(renderedAsListItem).toBe(true);
});

describe("filter", () => {
  let recipeBook;

  beforeEach(() => {
    recipeBook = createEmptyRecipeBook();
  });

  it("should render a meal filter object, too", () => {
    render(recipeBook.render());
    const mealNameFilter = screen.getByRole("textbox");
    expect(mealNameFilter).toBeDefined();
  });

  it("should render only the meals matching the filter", () => {
    const someMealName = "SomeMeal";
    recipeBook.add(createMealWithProperties({ mealName: someMealName }));
    render(recipeBook.render());
    const mealNameFilter = screen.getByRole("textbox");
    userEvent.type(mealNameFilter, "asdf");
    expect(screen.queryByText(someMealName)).not.toBeInTheDocument();
    userEvent.clear(mealNameFilter);
    expect(screen.getByText(someMealName)).toBeInTheDocument();
  });

  it("should reset page changes on filter changes", () => {
    prepareWithMealsAndRender(8);
    userEvent.click(screen.getByText("Nächste"));
    expect(screen.getAllByText(/Meal/)).toHaveLength(1);
    const mealNameFilter = screen.getByRole("textbox");
    userEvent.type(mealNameFilter, "Meal");
    expect(screen.getAllByText(/Meal/)).toHaveLength(7);
  });
});

describe("pagination", () => {
  it("should have pagination if there are more than 7 meals in it", async () => {
    prepareWithMealsAndRender(8);
    expect(screen.getByRole("navigation")).toBeDefined();
  });

  it("for 8 meals, there are 2 pages and no ellipses", async () => {
    prepareWithMealsAndRender(8);
    assertPagesAreShown(["1", "2"]);
    assertNumberOfPaginationEllipsesIs(0);
  });

  it("for 14 meals, there are 2 pages and no ellipses", async () => {
    prepareWithMealsAndRender(14);
    assertPagesAreShown(["1", "2"]);
    assertNumberOfPaginationEllipsesIs(0);
  });

  it("for 15 meals, there are 3 pages and no ellipses", async () => {
    prepareWithMealsAndRender(15);
    assertPagesAreShown(["1", "2", "3"]);
    assertNumberOfPaginationEllipsesIs(0);
  });

  it("for 22 meals, there are 4 pages and one ellipses", async () => {
    prepareWithMealsAndRender(22);
    assertPagesAreShown(["1", "2", "4"]);
    assertNumberOfPaginationEllipsesIs(1);
  });

  it("for 49 meals, there are 5 page buttons shown and two ellipses after clicking on next 3 times", async () => {
    prepareWithMealsAndRender(49);
    assertPagesAreShown(["1", "2", "7"]);
    assertNumberOfPaginationEllipsesIs(1);
    userEvent.click(screen.getByText("Nächste"));
    userEvent.click(screen.getByText("Nächste"));
    userEvent.click(screen.getByText("Nächste"));
    assertPagesAreShown(["1", "3", "4", "5", "7"]);
    assertNumberOfPaginationEllipsesIs(2);
  });

  it("should have next and previous buttons which work switch the pages", async () => {
    prepareWithMealsAndRender(49);
    userEvent.click(screen.getByText("Nächste"));
    assertPagesAreShown(["1", "2", "3", "7"]);
    assertNumberOfPaginationEllipsesIs(1);
    userEvent.click(screen.getByText("Vorherige"));
    assertPagesAreShown(["1", "2", "7"]);
    assertNumberOfPaginationEllipsesIs(1);
  });

  it("should have working page buttons", async () => {
    prepareWithMealsAndRender(49);
    assertPagesAreShown(["1", "2", "7"]);
    userEvent.click(screen.getByText("2"));
    assertPagesAreShown(["1", "2", "3", "7"]);
    userEvent.click(screen.getByText("7"));
    assertPagesAreShown(["1", "6", "7"]);
  });

  it("should be on the first page after rendering and disable the 'next page button' if on the last page", async () => {
    prepareWithMealsAndRender(8);
    const previousPageButton = screen.getByText("Vorherige");
    const nextPageButton = screen.getByText("Nächste");
    expect(previousPageButton).toBeDefined();
    expect(previousPageButton).toBeDisabled();
    expect(nextPageButton).toBeDefined();
    expect(screen.getAllByText(/Meal/)).toHaveLength(7);
    userEvent.click(nextPageButton);
    expect(nextPageButton).toBeDisabled();
    expect(screen.getAllByText(/Meal/)).toHaveLength(1);
  });

  it("should have no pagination if there are no more than 7 meals in it", async () => {
    prepareWithMealsAndRender(7);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
