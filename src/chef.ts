import axios from "axios";
import { Dish } from "./dishes/dish.tsx";
import { createEmptyDishPlan, DishPlan } from "./dishPlan/dishPlan.tsx";
import { createRecipeBookFromJson, RecipeBook } from "./recipeBook/recipeBook.tsx";
import { Buffer } from 'buffer';


let pickedDish: Dish

async function getRecipeBook(): RecipeBook {

    async function init() {
        if (typeof process != "undefined") {
            axios.defaults.adapter = require("axios/lib/adapters/http");
        }
        const rpc = axios.create({
            baseURL: "https://api.github.com/repos/PeregrinTooc/what-should-we-eat/contents",
        });
        const responseInGitHubFormat = await rpc.get("/src/dishes/resources/dishes.json");
        let base64FormatEncodedDishesData = responseInGitHubFormat.data.content;
        return Buffer.from(base64FormatEncodedDishesData, "base64").toString();
    }
    return createRecipeBookFromJson(await init())
}

function pickDish(dish: Dish) {
    pickedDish = dish
}

function getDishPlan(): DishPlan {
    return createEmptyDishPlan()
}

function addPickedDishForDayToDishPlan(dayId, dishPlan): void {
    dishPlan.addDishFor(dayId, pickedDish);
}

const chef = {
    pickDish: pickDish,
    getDishPlan: getDishPlan,
    getRecipeBook: getRecipeBook,
    addPickedDishForDayToDishPlan: addPickedDishForDayToDishPlan
}
export default chef 