import {
  Meal,
  createMealWithProperties,
  createMealFilterObject,
} from "./meal.tsx";
import chef from "./../chef.ts";
import { useState } from "react";
import { useSubscriber } from "./useSubscriber.ts";

export interface RecipeBook {
  render();
  add(meal: Meal);
}

export function createRecipeBookFromJson(mealsJSON: string): RecipeBook {
  return new RecipeBookImpl(
    JSON.parse(mealsJSON).meals.map((meal) => createMealWithProperties(meal))
  );
}

export function createEmptyRecipeBook(): RecipeBook {
  return new RecipeBookImpl([]);
}

class RecipeBookImpl implements RecipeBook {
  private filterObject = createMealFilterObject();
  private meals: Meal[];
  constructor(meals: Meal[]) {
    this.meals = meals;
  }
  add(meal: Meal) {
    this.meals.push(meal);
  }
  render() {
    return (
      <RecipeBookWithPagination
        meals={this.meals}
        filterObject={this.filterObject}
      />
    );
  }
}

function RecipeBookWithPagination({ meals, filterObject }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredMeals, setFilteredMeals] = useState(meals);
  const observer = (filter) => {
    setFilteredMeals(
      meals.filter((meal) => {
        return filter.matches(meal);
      })
    );
    setCurrentPage(1);
  };
  useSubscriber(filterObject, observer);
  return (
    <>
      <>{filterObject.render()}</>
      <ConditionalRecipeBookPagination
        numberOfMeals={filteredMeals.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {filteredMeals
        .slice((currentPage - 1) * 7, currentPage * 7)
        .map((meal, i) => {
          return <RecipeBookEntry key={i} meal={meal}></RecipeBookEntry>;
        })}
    </>
  );
}
function ConditionalRecipeBookPagination({
  numberOfMeals,
  currentPage,
  setCurrentPage,
}) {
  if (numberOfMeals > 7) {
    return (
      <RecipeBookPagination
        numberOfPages={Math.floor((numberOfMeals - 1) / 7) + 1}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    );
  } else {
    return <></>;
  }
}
function RecipeBookEntry({ meal }) {
  return (
    <>
      <div
        className="box"
        draggable
        onDragStart={() => {
          chef.pickMeal(meal);
        }}
      >
        {meal.renderAsListItemWithDetailsButton()}
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
