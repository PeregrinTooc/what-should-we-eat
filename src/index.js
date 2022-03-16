import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";

ReactDOM.render(
  <React.StrictMode>
    <App
      baseURI={
        "https://api.github.com/repos/PeregrinTooc/what-should-we-eat/contents"
      }
    />
  </React.StrictMode>,
  document.getElementById("root")
);
