import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

//useMemo - right now, we have createBundles in a dep array in cell-list, but createBundles keeps rebinding, thus keeps rerendering,
//thus creates an infinite loop. if we use useMemo to calculate the value, it is only done one single time, and only repeated when dep
//array changes. now createbundle is a stable function

//bind action creators to dispatch, export it as a hook for easier use
export const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
