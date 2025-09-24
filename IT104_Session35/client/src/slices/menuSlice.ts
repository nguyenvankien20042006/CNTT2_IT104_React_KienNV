import { createSlice } from '@reduxjs/toolkit';

interface ModeMenu {
    mode: 'full' | 'compact';
}

const initialState: ModeMenu = {
    mode: 'full',
};

const modeMenuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        changeModeMenu: (s) => {
            s.mode = s.mode === 'full' ? 'compact' : 'full';
        },
    },
});

export const { changeModeMenu } = modeMenuSlice.actions;
export const menuStore = modeMenuSlice.reducer;
