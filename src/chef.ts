import axios from "axios";
import { Meal } from "./meal.tsx";
import { createEmptyMealPlan, MealPlan } from "./meals/mealPlan.tsx";
import { createRecipeBookFromJson, RecipeBook } from "./meals/recipeBook.tsx";
import { Buffer } from 'buffer';


let pickedMeal: Meal

async function getRecipeBook(): RecipeBook {

    async function init() {
        if (typeof process != "undefined") {
            axios.defaults.adapter = require("axios/lib/adapters/http");
        }
        const rpc = axios.create({
            baseURL: "https://api.github.com/repos/PeregrinTooc/what-should-we-eat/contents",
        });
        const responseInGitHubFormat = await rpc.get("/src/meals/resources/meals.json");
        let base64FormatEncodedMealsData = responseInGitHubFormat.data.content;
        return Buffer.from(base64FormatEncodedMealsData, "base64").toString();
    }
    return createRecipeBookFromJson(await init())
}

function getPickedMeal(): Meal {
    return pickedMeal
}

function pickMeal(meal: Meal) {
    pickedMeal = meal
}

function getMealPlan(): MealPlan {
    return createEmptyMealPlan()
}

const chef = { pickMeal: pickMeal, getPickedMeal: getPickedMeal, getMealPlan: getMealPlan, getRecipeBook: getRecipeBook }
export default chef 