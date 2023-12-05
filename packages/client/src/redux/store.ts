import { combineSlices, configureStore } from '@reduxjs/toolkit'
import userReduer from './userSlice'

const store = configureStore({
    reducer: combineSlices({
        user: userReduer,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;


export default store
