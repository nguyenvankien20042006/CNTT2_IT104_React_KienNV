import { combineReducers } from 'redux';
import { profileReducer } from './profile.reducer';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import { userReducer } from './users.reducer';
import counterReducer from './counter.reducer';
import { randomNumberReducer } from './randomNumber.reducer';
import { changeStateReducer } from './changeState.reducer';
import { themeReducer } from './theme';
import { authReducer } from './Auth.reducer';
import todoReducer from './todoReducer';

export const reducers = combineReducers({
    profile: profileReducer,
    users: userReducer,
    counter: counterReducer,
    randomNumber: randomNumberReducer,
    changeState: changeStateReducer,
    theme: themeReducer,
    auth: authReducer,
    todos: todoReducer
});

export type ReducerType = ReturnType<typeof reducers>;
export const useAppSelector: TypedUseSelectorHook<ReducerType> = useSelector;
