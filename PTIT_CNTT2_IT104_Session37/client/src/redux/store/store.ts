import { configureStore } from '@reduxjs/toolkit';
import { studentStore } from '../reducers/studentSlice';

export const store = configureStore({
    reducer: { student: studentStore },
    // devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
