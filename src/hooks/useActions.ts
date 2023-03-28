import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

//bind action creators to dispatch, export it as a hook for easier use
export const useActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(actionCreators, dispatch);
}