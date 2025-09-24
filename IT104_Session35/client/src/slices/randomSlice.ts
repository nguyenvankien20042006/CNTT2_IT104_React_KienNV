import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ArrayRandom {
    list: number[];
}

const initialState: ArrayRandom = {
    list: [],
};

const randomSlice = createSlice({
    name: 'random',
    initialState,
    reducers: {
        random: (s, action: PayloadAction<number>) => {
            s.list.push(action.payload);
        },
    },
});

export const { random } = randomSlice.actions;
export const randomStore = randomSlice.reducer;
