import { combineReducers } from 'redux';
import { shoppingCartReducer } from './shop&cart';
export const reducers = combineReducers({
    shop: shoppingCartReducer,
});
