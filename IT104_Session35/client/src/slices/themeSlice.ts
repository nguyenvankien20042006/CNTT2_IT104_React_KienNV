import { createSlice } from '@reduxjs/toolkit';

interface Theme {
    type: 'light' | 'dark';
}

const initialState: Theme = {
    type: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        change: (s) => {
            s.type = s.type === 'light' ? 'dark' : 'light';
        },
    },
});

export const { change } = themeSlice.actions;
export const themeStore = themeSlice.reducer;
