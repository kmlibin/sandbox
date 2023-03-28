import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./state";
import CellList from "./components/cell-list";

//libraries
import "bulmaswatch/superhero/bulmaswatch.min.css";


const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
