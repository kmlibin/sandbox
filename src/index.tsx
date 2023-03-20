import ReactDOM from "react-dom";
import React from "react";

import CodeCell from "./components/code-cell";

//libraries
import "bulmaswatch/superhero/bulmaswatch.min.css";

const App = () => {
  return (
    <div>
      <CodeCell />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
