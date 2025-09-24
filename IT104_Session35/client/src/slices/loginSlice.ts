import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface LoginState {
    username: string;
    email: string;
    password: string;
}

const initialState: LoginState = {
    username: '',
    email: '',
    password: '',
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        login: (_, action: PayloadAction<LoginState>) => {
            return action.payload;
        },
    },
});

export const { login } = loginSlice.actions;
export const loginStore = loginSlice.reducer;
