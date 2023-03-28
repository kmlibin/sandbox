//remember, how we access state from our store
import { useSelector, TypedUseSelectorHook} from 'react-redux';
import { RootState } from '../state'; 

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;