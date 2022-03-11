import { render } from '@testing-library/react';
import { Meal } from './meal';
export enum Days{
  Monday
}
export interface MealPlan{
    addMealFor(day: Days, meal: Meal)
    render(
    ) 
      
}

export function createEmptyMealPlan(): MealPlan{
  return new MealPlanImpl()
}

class MealPlanImpl implements MealPlan{
  addMealFor(day: Days, meal: Meal) {
  }
  render(){}
}