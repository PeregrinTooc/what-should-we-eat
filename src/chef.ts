import { Meal } from "./meal.tsx";

let pickedMeal: Meal
function getPickedMeal() {
    return pickedMeal
}

function pickMeal(meal: Meal) {
    pickedMeal = meal
}

export const chef = { pickMeal: pickMeal, getPickedMeal: getPickedMeal }