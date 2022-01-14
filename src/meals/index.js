const axios = require('axios')
async function init(mealsFilePath) {
    const jsonArray = await axios.get('https://github.com/PeregrinTooc/what-should-we-eat/blob/main/src/meals/resources/meals.csv');
    return new MealsHandler(jsonArray)
}

function getMealPlan() { return new MealPlan() }

class MealPlan {
    constructor() {
        this._meals = new Map()
    }
    addMealFor(day, meal) {
        this._meals.set(day, meal)
    }
    getMealFor(day) {
        return this._meals.get(day)
    }
}

class MealsHandler {
    constructor(meals) {
        this._meals = meals
    }
    getAllMeals() { return this._meals }
}

module.exports = { init, getMealPlan }