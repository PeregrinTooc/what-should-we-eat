
export interface RecipeBook{}

export function createRecipeBookFromJson(mealsJSON: string): RecipeBook {
         return JSON.parse(mealsJSON)
     }
 class RecipeBookImpl implements RecipeBook{

}

