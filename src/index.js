import { StrictMode } from "react";
import ReactDOM from "react-dom";

import Donut from "./Donut";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <Donut />
  </StrictMode>,
  rootElement
);
