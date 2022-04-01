import { Meal } from "./meal.tsx";
import { createEmptyMealPlan, MealPlan } from "./meals/mealPlan.tsx";
import { createRecipeBookFromJson, RecipeBook } from "./meals/recipeBook.tsx";
let pickedMeal: Meal

function getRecipeBook(): RecipeBook{

    const mondayMealName = "Ofengemüse mit Kartoffeln und Tzatziki";
    const recipeBook = createRecipeBookFromJson(
        JSON.stringify([
            {
                mealName: mondayMealName,
                effort: 3,
                tags: ["Kartoffeln"],
                healthLevel: 7,
            },
            { mealName: "Foo", tags: ["foo", "bar"], effort: 2, healthLevel: 4 },
        ])
        );
        return recipeBook
    }

function getPickedMeal():Meal {
    return pickedMeal
}

function pickMeal(meal: Meal) {
    pickedMeal = meal
}

function getMealPlan():MealPlan{
    return createEmptyMealPlan()
}

const chef = { pickMeal: pickMeal, getPickedMeal: getPickedMeal, getMealPlan: getMealPlan, getRecipeBook : getRecipeBook }
export default chef 