import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
    language: 'vnese' | 'eng';
}

const initialState: LanguageState = {
    language: 'vnese',
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        changeLanguage: (s, action: PayloadAction<'vnese' | 'eng'>) => {
            s.language = action.payload;
        },
    },
});

export const { changeLanguage } = languageSlice.actions;
export const languageStore = languageSlice.reducer;
