const axios = require('axios')
const { Buffer } = require('buffer');
async function init(mealsFilePath) {
    const jsonArray = await axios.get('https://api.github.com/repos/PeregrinTooc/what-should-we-eat/contents/src/meals/resources/meals.json')
    let encodedData = jsonArray.data.content;
    const buffer = Buffer.from(encodedData, 'base64')
    const meals = buffer.toString()
    console.log(meals)
    return new MealsHandler(JSON.parse(meals).meals)
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