import axios from "axios";
import { Dish } from "./dishes/dish.tsx";
import { createEmptyDishPlan, DishPlan, createDishPlanFromJSON } from "./dishPlan/dishPlan.tsx";
import { createRecipeBookFromJson, RecipeBook } from "./recipeBook/recipeBook.tsx";
import { Buffer } from 'buffer';
import { getCookieJar } from './utils/cookieJar.ts';


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
    const cookieJar = getCookieJar();
    const storedDishPlan = cookieJar.takeCookie('dishPlan')
    const result = storedDishPlan === '' ? createEmptyDishPlan() : createDishPlanFromJSON(storedDishPlan);
    result.subscribe((dishPlan: DishPlan) => cookieJar.putCookie('dishPlan', dishPlan.exportDishesToJSON()))
    return result
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