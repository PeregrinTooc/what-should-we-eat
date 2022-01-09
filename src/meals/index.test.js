const cut = require('./index.js')
const fs = require('fs')
const masterFilePath = 'src/meals/resources/meals.test.master.csv'
const filePath = 'src/meals/resources/meals.test.csv'
let mealsHandler
let mealPlan
let meals

beforeEach(async () => {
    const master = fs.readFileSync(masterFilePath, 'utf8')
    fs.writeFileSync(filePath, master)
    mealsHandler = await cut.init(filePath)
    mealPlan = cut.getMealPlan()
    meals = mealsHandler.getAllMeals()
})

test('init should return an object with a method getAllMeals', () => {
    expect(mealsHandler).toBeDefined()
    expect(mealsHandler.getAllMeals).toBeDefined()
})

test('getAllMeals should return an array of meals', () => {
    expect(meals).toBeDefined()
    expect(meals[0]).toEqual(
        {
            mealName: 'Spaghetti mit Spinatsauce',
            effort: '2',
            tags: 'Pasta',
            healthLevel: '7'
        }
    )
})

test('Meal Plans should have a function getMealFor', () => {
    mealPlan.addMealFor('Monday', { mealName: 'S' })
    expect(mealPlan.getMealFor('Monday')).toEqual({ mealName: 'S' })
    mealPlan.addMealFor('Monday', { mealName: 'T' })
    expect(mealPlan.getMealFor('Monday')).toEqual({ mealName: 'T' })
    mealPlan.addMealFor('Tuesday', { mealName: 'S' })
    expect(mealPlan.getMealFor('Monday')).toEqual({ mealName: 'T' })
})

