import { createSlice } from '@reduxjs/toolkit';

interface Mode {
    data: number[];
    mode: 'list' | 'grid';
}

const initialState: Mode = {
    data: [1, 2, 3, 4, 5,6],
    mode: 'list',
};

const modeSlice = createSlice({
    name: 'mode',
    initialState,
    reducers: {
        changeMode: (s) => {
            s.mode = s.mode === 'list' ? 'grid' : 'list';
        },
    },
});

export const { changeMode } = modeSlice.actions;
export const modeStore = modeSlice.reducer;
