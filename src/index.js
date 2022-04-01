import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import chef from "./chef.ts";
import "bulma/css/bulma.min.css";
import { createDesk } from "./desk.tsx";

function App() {
  const [desk, setDesk] = useState({
    render: () => {
      return <></>;
    },
  });
  useEffect(() => {
    async function getDesk() {
      const mealPlan = chef.getMealPlan();
      const recipeBook = await chef.getRecipeBook();
      setDesk(createDesk(mealPlan, recipeBook));
    }
    getDesk();
  }, []);

  return <>{desk.render()}</>;
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
