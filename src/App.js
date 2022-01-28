import React from "react";
import "bulma/css/bulma.min.css";
import { Columns, Heading } from "react-bulma-components";
import Table from "./components/MealOverviewTable";
import MealPlan from "./components/MealPlan";

function App() {
  return (
    <div>
      <Heading>Was wollen wir essen?</Heading>
      <Columns>
        <Columns.Column>
          <Table />
        </Columns.Column>
        <Columns.Column>
          <MealPlan />
        </Columns.Column>
      </Columns>
    </div>
  );
}

export default App;
