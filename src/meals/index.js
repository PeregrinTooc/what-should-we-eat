const csvToJson = require('csvtojson')
async function init(mealsFilePath) {
    const jsonArray = await csvToJson({ delimiter: '|' }).fromFile(mealsFilePath);
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