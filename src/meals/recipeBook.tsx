import { Meal, createMealFromJSON } from "./meal.tsx";

const observers: Function[] = [];
export interface RecipeBook {
  render();
}

export function createRecipeBookFromJson(mealsJSON: string): RecipeBook {
  return new RecipeBookImpl(JSON.parse(mealsJSON));
}

export function registerDragObserver(observer) {
  observers.push(observer);
}

function setDraggedMealForObservers(meal: Meal) {
  observers.forEach((observer) => observer(meal));
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
          return (
            <RecipeBookEntry
              key={i}
              meal={meal}
              recipebook={this}
            ></RecipeBookEntry>
          );
        })}
      </>
    );
  }
}

function RecipeBookEntry({ meal, recipebook }) {
  return (
    <>
      <div
        className="box"
        draggable
        onDragStart={(e) => {
          setDraggedMealForObservers(meal);
        }}
      >
        {meal.renderAsListItemWithDetailsButton()}
      </div>
    </>
  );
}
