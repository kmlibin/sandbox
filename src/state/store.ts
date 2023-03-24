import { createStore, applyMiddleware }from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

//second argument is state (empty obj in this case)
export const store = createStore(reducers, {}, applyMiddleware(thunk))