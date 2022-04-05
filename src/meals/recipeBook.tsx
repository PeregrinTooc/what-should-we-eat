import { Meal, createMealWithProperties } from "./meal.tsx";
import chef from "./../chef.ts";
import { useState } from "react";

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
  private meals: Meal[];
  constructor(meals: Meal[]) {
    this.meals = meals;
  }
  add(meal: Meal) {
    this.meals.push(meal);
  }
  render() {
    return <RecipeBookWithPagination meals={this.meals} />;
  }
}

function RecipeBookWithPagination({ meals }) {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <>
      <ConditionalRecipeBookPagination
        meals={meals}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {meals.slice((currentPage - 1) * 7, currentPage * 7).map((meal, i) => {
        return <RecipeBookEntry key={i} meal={meal}></RecipeBookEntry>;
      })}
    </>
  );
}
function ConditionalRecipeBookPagination({
  meals,
  currentPage,
  setCurrentPage,
}) {
  if (meals.length > 7) {
    return (
      <RecipeBookPagination
        numberOfPages={Math.floor((meals.length - 1) / 7) + 1}
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
    <nav className="pagination" role="navigation" aria-label="pagination">
      <button
        className="pagination-previous"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Vorherige
      </button>
      <button
        className="pagination-next"
        disabled={currentPage === numberOfPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Nächste
      </button>
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
