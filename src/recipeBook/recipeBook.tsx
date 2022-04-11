import {
  Dish,
  createDishWithProperties,
  DishListItemFormat,
} from "./../dishes/Dish.tsx";
import { createDishFilterObject } from "./../dishes/DishNameFilter.tsx";
import chef from "./../chef.ts";
import { useState } from "react";
import { useSubscriber } from "./../utils/useSubscriber.ts";

export interface RecipeBook {
  render();
  add(dish: Dish);
}

export function createRecipeBookFromJson(dishesJSON: string): RecipeBook {
  return new RecipeBookImpl(
    JSON.parse(dishesJSON).dishes.map((dish) => createDishWithProperties(dish))
  );
}

export function createEmptyRecipeBook(): RecipeBook {
  return new RecipeBookImpl([]);
}

class RecipeBookImpl implements RecipeBook {
  private filterObject = createDishFilterObject();
  private dishes: Dish[];
  constructor(dishes: Dish[]) {
    this.dishes = dishes;
  }
  add(dish: Dish) {
    this.dishes.push(dish);
  }
  render() {
    return (
      <RecipeBookWithPagination
        dishes={this.dishes}
        filterObject={this.filterObject}
      />
    );
  }
}

function RecipeBookWithPagination({ dishes, filterObject }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredDishes, setFilteredDishes] = useState(dishes);
  const observer = (filter) => {
    setFilteredDishes(
      dishes.filter((dish) => {
        return filter.matches(dish);
      })
    );
    setCurrentPage(1);
  };
  useSubscriber(filterObject, observer);
  return (
    <>
      <>{filterObject.render()}</>
      <ConditionalRecipeBookPagination
        numberOfDishes={filteredDishes.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {filteredDishes
        .slice((currentPage - 1) * 7, currentPage * 7)
        .map((dish, i) => {
          return <RecipeBookEntry key={i} dish={dish}></RecipeBookEntry>;
        })}
    </>
  );
}
function ConditionalRecipeBookPagination({
  numberOfDishes,
  currentPage,
  setCurrentPage,
}) {
  if (numberOfDishes > 7) {
    return (
      <RecipeBookPagination
        numberOfPages={Math.floor((numberOfDishes - 1) / 7) + 1}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    );
  } else {
    return <></>;
  }
}
function RecipeBookEntry({ dish }) {
  const format = new DishListItemFormat(dish);
  dish.export(format);
  return (
    <>
      <div
        className="box"
        draggable
        onDragStart={() => {
          chef.pickDish(dish);
        }}
      >
        {format.render()}
      </div>
    </>
  );
}
function RecipeBookPagination({ numberOfPages, currentPage, setCurrentPage }) {
  return (
    <nav
      className="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <PreviousPageButton
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <NextPageButton
        currentPage={currentPage}
        numberOfPages={numberOfPages}
        setCurrentPage={setCurrentPage}
      />
      <ul className="pagination-list">
        <FirstPageButton
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <CurrentPageBlock
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numberOfPages={numberOfPages}
        />
        <LastPageButton
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numberOfPages={numberOfPages}
        />
      </ul>
    </nav>
  );
}

function FirstPageButton({ currentPage, setCurrentPage }) {
  return (
    <>
      {currentPage === 1 ? (
        <CurrentRecipeBookPageButton page={1} />
      ) : (
        <RecipeBookPageButton page={1} setCurrentPage={setCurrentPage} />
      )}
      {currentPage >= 3 ? <PaginationEllipsis /> : null}
    </>
  );
}

function PaginationEllipsis() {
  return (
    <li>
      <span className="pagination-ellipsis">{"\u2026"}</span>
    </li>
  );
}

function RecipeBookPageButton({ page, setCurrentPage }) {
  return (
    <li>
      <button
        className="pagination-link"
        aria-label={`Goto page ${page}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    </li>
  );
}

function CurrentRecipeBookPageButton({ page }) {
  return (
    <li>
      <button
        className="pagination-link is-current"
        aria-label={`Goto page ${page}`}
        aria-current="page"
      >
        {page}
      </button>
    </li>
  );
}

function CurrentPageBlock({ currentPage, numberOfPages, setCurrentPage }) {
  return (
    <>
      {currentPage > 2 ? (
        <RecipeBookPageButton
          page={currentPage - 1}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
      {currentPage !== 1 && currentPage !== numberOfPages ? (
        <CurrentRecipeBookPageButton page={currentPage} />
      ) : null}
      {currentPage <= numberOfPages - 2 ? (
        <RecipeBookPageButton
          page={currentPage + 1}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
    </>
  );
}

function LastPageButton({ numberOfPages, currentPage, setCurrentPage }) {
  return (
    <>
      {numberOfPages - currentPage > 2 ? <PaginationEllipsis /> : null}
      {currentPage === numberOfPages ? (
        <CurrentRecipeBookPageButton page={numberOfPages} />
      ) : (
        <RecipeBookPageButton
          page={numberOfPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}

function PreviousPageButton({ currentPage, setCurrentPage }) {
  return (
    <button
      className="pagination-previous"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      Vorherige
    </button>
  );
}

function NextPageButton({ currentPage, numberOfPages, setCurrentPage }) {
  return (
    <button
      className="pagination-next"
      disabled={currentPage === numberOfPages}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      Nächste
    </button>
  );
}
