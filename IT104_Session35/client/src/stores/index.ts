import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from '../slices/counterSlice';
import { randomStore } from '../slices/randomSlice';
import { themeStore } from '../slices/themeSlice';
import { modeStore } from '../slices/modeSlice';
import { menuStore } from '../slices/menuSlice';
import { languageStore } from '../slices/languageSlice';
import { favoriteUserStore } from '../slices/listFavoriteUser';
import { loginStore } from '../slices/loginSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        random: randomStore,
        theme: themeStore,
        mode: modeStore,
        modeMenu: menuStore,
        language: languageStore,
        favoriteUser: favoriteUserStore,
        login:loginStore
    },
    devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
