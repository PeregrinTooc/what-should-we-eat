import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import chef from "./chef.ts";
import "bulma/css/bulma.min.css";
import createDesk from "./desk.tsx";

function App() {
  const [desk, setDesk] = useState({
    render: () => {
      return <></>;
    },
  });
  useEffect(() => {
    chef.getRecipeBook().then((recipeBook) => {
      setDesk(createDesk(chef.getDishPlan(), recipeBook));
    });
  }, []);

  return <>{desk.render()}</>;
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
