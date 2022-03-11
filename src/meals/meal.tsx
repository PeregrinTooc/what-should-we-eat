export interface Meal{}

export function createMealFromJSON(meal: string):Meal{
    return JSON.parse(meal)
}