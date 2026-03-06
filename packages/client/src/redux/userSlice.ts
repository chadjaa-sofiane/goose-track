import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit'
import {
    getUserData,
    updateUserData,
    UpdateUserDataInputs,
    UserFields,
} from '@/api/userApi'
import { setAuthBootstrapped, setIsLoggedIn } from './authSlice'

type UserStates = {
    isLoading: boolean
    data: UserFields | null
    errors: unknown
}

const initialState: UserStates = {
    isLoading: true,
    data: null,
    errors: null,
}

export const getUserDataAsync = createAsyncThunk(
    'user/getUserData',
    async (_, { dispatch }) => {
        const result = await getUserData()
        dispatch(setIsLoggedIn(result.success))
        dispatch(setAuthBootstrapped(true))
        return result
    }
)

export const updateUserDataAsync = createAsyncThunk(
    'user/updateUserData',
    async (credentials?: UpdateUserDataInputs) => {
        return await updateUserData(credentials)
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserFields>) => {
            state.data = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDataAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserDataAsync.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload.success ? action.payload.data : null
                state.errors = action.payload.errors
            })
            .addCase(getUserDataAsync.rejected, (state) => {
                state.isLoading = false
                state.data = null
            })
            .addCase(updateUserDataAsync.fulfilled, (state, action) => {
                if (action.payload?.success) {
                    state.data = action.payload.data
                }
            })
    },
})

export const { setUserData } = userSlice.actions
export default userSlice.reducer
