import React, { useState } from 'react'
import "bulma/css/bulma.min.css";
import { Form } from "react-bulma-components";

export interface Meal{
  render(dayName:string):any
}

export function createMealFromJSON(meal: string):Meal{
    const mealProps = JSON.parse(meal)
    return new MealImpl({...mealProps})
}

export function createEmptyMeal():Meal {
    return new MealImpl({})
    }

    class MealImpl implements Meal{
    private mealName: string;
    private effort: number;
    private tags: string[]|any;
    private healthLevel: number;
    constructor( properties ){
      this.mealName = properties.mealName ? properties.mealName : "";
      this.effort = properties.effort ? properties.effort : "";
      this.tags = properties.tags ? [...properties.tags] : "";
      this.healthLevel = properties.healthLevel ? properties.healthLevel : "";
    }
        render(){
            return <MealComponent mealDisplayName = {this.mealName} />
        }
    }

    function MealComponent({mealDisplayName}) {
      return (<Form.Control>
           {mealDisplayName}
        </Form.Control>);
    }