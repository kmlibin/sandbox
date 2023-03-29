import { combineReducers } from "@reduxjs/toolkit";
import cellsReducer from "./cellsReducer";
import bundlesReducer from './bundlesReducer'

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer
});

export default reducers;
export type RootState = ReturnType<typeof reducers>;
