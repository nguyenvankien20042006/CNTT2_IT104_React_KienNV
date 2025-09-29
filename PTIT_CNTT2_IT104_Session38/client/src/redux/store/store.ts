import { configureStore } from '@reduxjs/toolkit';
import { bookStore } from '../reducers/bookSlice';

export const store = configureStore({
    reducer: { book: bookStore },
    // devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
