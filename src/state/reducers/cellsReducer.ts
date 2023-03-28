import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

//import immer

import produce from "immer";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action): CellsState | void => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;

    //without immer, normal redux. creating a new object because you can't directly mutate state with plain redux
    // return {
    //   ...state,
    //   //creating a new object
    //   data: {
    //     //copy over all of the old state.data
    //     ...state.data,
    //     //key of action.pay.id : //keep all properties from that state (...), add the new content
    //     [action.payload.id] : {...state.data[action.payload.id], content: action.payload.content}
    //   }
    // }

    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;

    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      //find index of cell we want to move
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      //make sure target index is in bounds of the array
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }
      //swap index and target index
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;

    case ActionType.INSERT_CELL_BEFORE:
      //create new cell
      const cell: Cell = {
        content: "",
        type: action.payload.type,
        id: randomId(),
      };
      //generate new id in the data prop, assign our new cell to it
      state.data[cell.id] = cell;

      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );
      //if it can't find the index, it returns -1, push it at the end of the list.
      if (foundIndex < 0) {
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      }

      return state;

    default:
      return state;
  }
}, initialState);

//generate random id
const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
