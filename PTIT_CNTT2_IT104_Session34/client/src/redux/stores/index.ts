import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "../reducers"
const store = configureStore ({
    reducer: rootReducer
})
export default store
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']