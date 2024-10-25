import { configureStore } from "@reduxjs/toolkit";
import servicesList from './apps/services'
import review from './apps/review'

export const store = configureStore ({
    reducer : {
        servicesList,
        review
    },
    middleware : getDefaultMiddleware => 
        getDefaultMiddleware({
            serializableCheck : false
        })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>