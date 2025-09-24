import { createSlice } from '@reduxjs/toolkit';
interface CounterState {
    value: number;
}
const initialState: CounterState = {
    value: 0,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increase: (state) => {
            state.value += 1;
        },
        decrease: (state) => {
            state.value -= 1;
        },
        reset: (state) => {
            state.value = 0;
        },
    },
});

export const { increase, decrease, reset } = counterSlice.actions;
export const counterReducer = counterSlice.reducer;
