import { Meal, createMealFromJSON } from "./meal.tsx";
import chef from "./../chef.ts";

export interface RecipeBook {
  render();
}

export function createRecipeBookFromJson(mealsJSON: string): RecipeBook {
  return new RecipeBookImpl(JSON.parse(mealsJSON).meals);
}

class RecipeBookImpl implements RecipeBook {
  private meals: Meal[];
  constructor(meals: Meal[]) {
    this.meals = meals.map((meal) => {
      return createMealFromJSON(JSON.stringify(meal));
    });
  }
  render() {
    return (
      <>
        {this.meals.map((meal, i) => {
          return <RecipeBookEntry key={i} meal={meal}></RecipeBookEntry>;
        })}
      </>
    );
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
