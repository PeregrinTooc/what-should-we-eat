import { MealPlan } from "./meals/mealPlan.tsx";
import { RecipeBook } from "./meals/recipeBook.tsx";
import { Columns, Container, Heading } from "react-bulma-components";
export function createDesk(mealPlan: MealPlan, recipeBook: RecipeBook) {
  return {
    render: () => {
      return <Desk mealPlan={mealPlan} recipeBook={recipeBook} />;
    },
  };
}

function Desk({ mealPlan, recipeBook }) {
  return (
    <Container>
      <Heading>Was wollen wir essen?</Heading>
      <Columns centered={true}>
        <Columns.Column>{mealPlan.render()}</Columns.Column>
        <Columns.Column>{recipeBook.render()}</Columns.Column>
      </Columns>
    </Container>
  );
}
