import { Meal, createMealFromJSON } from "./meal.tsx";
export interface RecipeBook {
  render();
}

export function createRecipeBookFromJson(mealsJSON: string): RecipeBook {
  return new RecipeBookImpl(JSON.parse(mealsJSON));
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
      <div className="box" draggable>
        {this.meals.map((meal) => {
          return meal.renderAsListItem();
        })}
      </div>
    );
  }
}
