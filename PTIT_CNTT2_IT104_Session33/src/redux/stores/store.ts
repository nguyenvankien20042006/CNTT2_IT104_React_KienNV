import { createStore } from 'redux';
import { reducers } from '../reducers/reducers';

export const store = createStore(reducers);
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']