import cellsReducer from "./cellsReducer";
import { combineReducers } from "@reduxjs/toolkit";

const reducers = combineReducers({
  cells: cellsReducer,
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
