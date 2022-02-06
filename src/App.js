import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { Columns, Heading } from "react-bulma-components";
import MealsTable from "./components/MealOverviewTable";
import MealPlan from "./components/MealPlan";
import html2canvas from "html2canvas";

function App({ baseURI }) {
  const [data, setData] = useState([]);
  const [mealPlan, updateMealPlan] = useState(Array(7).fill(""));
  const [mealPlanController, updateMealPlanController] = useState();
  const saveAsImage = async (element) => {
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };
  useEffect(() => {
    async function fetchData() {
      const init = require("./meals/index.js").init;
      const filePath = "/src/meals/resources/meals.json";
      const mealHandler = await init(baseURI, filePath);
      setData(mealHandler.getAllMeals());
    }
    fetchData();
    const mealPlanController = require("./meals/index.js").getMealPlan();
    updateMealPlan(mealPlanController.getOverview());
    updateMealPlanController(mealPlanController);
  }, [baseURI]);
  const mealPlanControl = { mealPlanController, updateMealPlan };
  return (
    <div>
      <Heading>Was wollen wir essen?</Heading>
      <Columns>
        <Columns.Column>
          <MealsTable availableMeals={data} {...mealPlanControl} />
        </Columns.Column>
        <Columns.Column>
          <MealPlan
            mealPlan={mealPlan}
            saveAsImage={saveAsImage}
            {...mealPlanControl}
          />
        </Columns.Column>
      </Columns>
    </div>
  );
}

export default App;
