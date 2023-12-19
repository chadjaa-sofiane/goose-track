import { combineSlices, configureStore } from '@reduxjs/toolkit'
import userReduer from './userSlice'
import authSlice from './authSlice'
import calendarReducer from './calendarSlice'

export const createStore = () =>
    configureStore({
        reducer: combineSlices({
            auth: authSlice,
            user: userReduer,
            calendar: calendarReducer,
        }),
    })

const store = createStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
