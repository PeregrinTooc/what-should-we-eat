import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Columns, Heading } from "react-bulma-components";
import MealsTable from "./components/MealOverviewTable";
import MealPlan from "./components/MealPlan";

function App() {
  const [data, setData] = useState([]);
  const [mealPlan, updateMealPlan] = useState(Array(7).fill(""));
  const [mealPlanController, updateMealPlanController] = useState();
  useEffect(() => {
    async function fetchData() {
      const init = require("./meals/index.js").init;
      const mealPlanController = require("./meals/index.js").getMealPlan();
      const filePath = "/src/meals/resources/meals.json";
      const baseURI =
        "https://api.github.com/repos/PeregrinTooc/what-should-we-eat/contents";
      const mealHandler = await init(baseURI, filePath);
      setData(mealHandler.getAllMeals());
      updateMealPlan(mealPlanController.getOverview());
      updateMealPlanController(mealPlanController);
    }
    fetchData();
  }, []);
  return (
    <div>
      <Heading>Was wollen wir essen?</Heading>
      <Columns>
        <Columns.Column>
          <MealsTable
            data={data}
            mealPlanController={mealPlanController}
            updateMealPlan={updateMealPlan}
          />
        </Columns.Column>
        <Columns.Column>
          <MealPlan mealPlan={mealPlan} />
        </Columns.Column>
      </Columns>
    </div>
  );
}

export default App;
