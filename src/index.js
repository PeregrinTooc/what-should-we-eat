import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import chef from "./chef.ts";
import "bulma/css/bulma.min.css";
import { createDesk } from "./desk.tsx";

function App() {
  const desk = createDesk(chef.getMealPlan(), chef.getRecipeBook());
  return <>{desk.render()}</>;
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
