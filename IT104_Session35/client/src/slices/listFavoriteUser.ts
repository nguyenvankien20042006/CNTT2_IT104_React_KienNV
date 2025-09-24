import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FavoriteUser {
    username: string;
    like: boolean;
    id: number;
}

const initialState: FavoriteUser[] = [
    {
        id: 1,
        username: 'Nguyễn Văn A',
        like: false,
    },
    {
        username: 'Nguyễn Văn B',
        id: 2,
        like: false,
    },
    {
        id: 3,
        username: 'Nguyễn Văn C',
        like: false,
    },
    {
        id: 4,
        username: 'Nguyễn Văn D',
        like: false,
    },
];

const favoriteUserSlice = createSlice({
    name: 'favoriteUser',
    initialState,
    reducers: {
        like: (state, action: PayloadAction<number>) => {
            const user = state.find(u => u.id === action.payload);
            if (user) {
                user.like = !user.like; // mutate trực tiếp
            }
        },
    },
});


export const { like } = favoriteUserSlice.actions;
export const favoriteUserStore = favoriteUserSlice.reducer;
