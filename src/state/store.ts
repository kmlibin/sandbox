import { createStore, applyMiddleware }from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {ActionType } from './action-types'
//second argument is state (empty obj in this case)
export const store = createStore(reducers, {}, applyMiddleware(thunk))

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        content: 'hello2',
        id: '123',
        type: 'code',
    }
})

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        content: 'hello',
        id: '13',
        type: 'text',
    }
})

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        content: 'hello',
        id: '13',
        type: 'text',
    }
})

store.dispatch({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        content: 'hello',
        id: '13',
        type: 'code',
    }
})