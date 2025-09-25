import { configureStore } from '@reduxjs/toolkit';
import { taskStore } from '../redux/taskSlice';

export const store = configureStore({
    reducer: {task:taskStore},
    devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
