import { createRecipeBookFromJson, createEmptyRecipeBook } from "./recipeBook";
import { render, screen } from "@testing-library/react";
import { mondayDish, mondayDishName } from "../dishes/resources/testDishes";
import userEvent from "@testing-library/user-event";
import { createDishWithProperties } from "../dishes/Dish";

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
      return text !== "Nächste" && text !== "Vorherige" && text !== "Details";
    })
    .sort();
  let expectedButtonTexts = pagesTexts.sort();
  expect(actualButtonTexts).toEqual(expectedButtonTexts);
}

function prepareWithDishesAndRender(numberOfDishes) {
  const recipeBook = createEmptyRecipeBook();
  for (let i = 0; i < numberOfDishes; i++) {
    const dishName = `Dish Number ${i}`;
    recipeBook.add(createDishWithProperties({ dishName: dishName }));
  }
  render(recipeBook.render());
}

it("should be possible to add dishes to the book", () => {
  const recipeBook = createEmptyRecipeBook();
  recipeBook.add(mondayDish);
});

it("should be possible to create a recipebook from JSON", () => {
  const recipeBook = createRecipeBookFromJson(
    JSON.stringify({ dishes: [mondayDish] })
  );
  expect(recipeBook).toBeDefined();
});
it("should render itself and delegate rendering of its contents to the dishes", () => {
  const recipeBook = createEmptyRecipeBook();
  recipeBook.add(mondayDish);
  render(recipeBook.render());
  expect(screen.getByText(mondayDishName)).toBeDefined();
});

describe("filter", () => {
  let recipeBook;

  beforeEach(() => {
    recipeBook = createEmptyRecipeBook();
  });

  it("should render a dish filter object, too", () => {
    render(recipeBook.render());
    const dishNameFilter = screen.getByRole("textbox");
    expect(dishNameFilter).toBeDefined();
  });

  it("should render only the dishes matching the filter", () => {
    const someDishName = "SomeDish";
    recipeBook.add(createDishWithProperties({ dishName: someDishName }));
    render(recipeBook.render());
    const dishNameFilter = screen.getByRole("textbox");
    userEvent.type(dishNameFilter, "asdf");
    expect(screen.queryByText(someDishName)).not.toBeInTheDocument();
    userEvent.clear(dishNameFilter);
    expect(screen.getByText(someDishName)).toBeInTheDocument();
  });

  it("should reset page changes on filter changes", () => {
    prepareWithDishesAndRender(8);
    userEvent.click(screen.getByText("Nächste"));
    expect(screen.getAllByText(/Dish/)).toHaveLength(1);
    const dishNameFilter = screen.getByRole("textbox");
    userEvent.type(dishNameFilter, "Dish");
    expect(screen.getAllByText(/Dish/)).toHaveLength(7);
  });
});

describe("pagination", () => {
  it("should have pagination if there are more than 7 dishes in it", async () => {
    prepareWithDishesAndRender(8);
    expect(screen.getByRole("navigation")).toBeDefined();
  });

  it("for 8 dishes, there are 2 pages and no ellipses", async () => {
    prepareWithDishesAndRender(8);
    assertPagesAreShown(["1", "2"]);
    assertNumberOfPaginationEllipsesIs(0);
  });

  it("for 14 dishes, there are 2 pages and no ellipses", async () => {
    prepareWithDishesAndRender(14);
    assertPagesAreShown(["1", "2"]);
    assertNumberOfPaginationEllipsesIs(0);
  });

  it("for 15 dishes, there are 3 pages and no ellipses", async () => {
    prepareWithDishesAndRender(15);
    assertPagesAreShown(["1", "2", "3"]);
    assertNumberOfPaginationEllipsesIs(0);
  });

  it("for 22 dishes, there are 4 pages and one ellipses", async () => {
    prepareWithDishesAndRender(22);
    assertPagesAreShown(["1", "2", "4"]);
    assertNumberOfPaginationEllipsesIs(1);
  });

  it("for 49 dishes, there are 5 page buttons shown and two ellipses after clicking on next 3 times", async () => {
    prepareWithDishesAndRender(49);
    assertPagesAreShown(["1", "2", "7"]);
    assertNumberOfPaginationEllipsesIs(1);
    userEvent.click(screen.getByText("Nächste"));
    userEvent.click(screen.getByText("Nächste"));
    userEvent.click(screen.getByText("Nächste"));
    assertPagesAreShown(["1", "3", "4", "5", "7"]);
    assertNumberOfPaginationEllipsesIs(2);
  });

  it("should have next and previous buttons which work switch the pages", async () => {
    prepareWithDishesAndRender(49);
    userEvent.click(screen.getByText("Nächste"));
    assertPagesAreShown(["1", "2", "3", "7"]);
    assertNumberOfPaginationEllipsesIs(1);
    userEvent.click(screen.getByText("Vorherige"));
    assertPagesAreShown(["1", "2", "7"]);
    assertNumberOfPaginationEllipsesIs(1);
  });

  it("should have working page buttons", async () => {
    prepareWithDishesAndRender(49);
    assertPagesAreShown(["1", "2", "7"]);
    userEvent.click(screen.getByText("2"));
    assertPagesAreShown(["1", "2", "3", "7"]);
    userEvent.click(screen.getByText("7"));
    assertPagesAreShown(["1", "6", "7"]);
  });

  it("should be on the first page after rendering and disable the 'next page button' if on the last page", async () => {
    prepareWithDishesAndRender(8);
    const previousPageButton = screen.getByText("Vorherige");
    const nextPageButton = screen.getByText("Nächste");
    expect(previousPageButton).toBeDefined();
    expect(previousPageButton).toBeDisabled();
    expect(nextPageButton).toBeDefined();
    expect(screen.getAllByText(/Dish/)).toHaveLength(7);
    userEvent.click(nextPageButton);
    expect(nextPageButton).toBeDisabled();
    expect(screen.getAllByText(/Dish/)).toHaveLength(1);
  });

  it("should have no pagination if there are no more than 7 dishes in it", async () => {
    prepareWithDishesAndRender(7);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
