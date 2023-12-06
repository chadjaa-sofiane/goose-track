import { combineSlices, configureStore } from '@reduxjs/toolkit'
import userReduer from './userSlice'
import authSlice from './authSlice'

const store = configureStore({
    reducer: combineSlices({
        auth: authSlice,
        user: userReduer,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
