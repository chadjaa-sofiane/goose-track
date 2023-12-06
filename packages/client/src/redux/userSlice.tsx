import { getUserData, UserData } from "@/api/userApi"
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { setIsLoggedIn } from "./authSlice"


type UserStates = {
    isLoading: boolean
    data: UserData | null
    errors: unknown
}

const initialState: UserStates = {
    isLoading: true,
    data: null,
    errors: null
}


export const getUserDataAsync = createAsyncThunk("user/getUserData", async (_, { dispatch }) => {
    dispatch(setIsLoading(true));
    const result = await getUserData();
    if (result.success) {
        dispatch(setIsLoggedIn(true))
    }
    dispatch(setIsLoading(false))
    return result
})

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setUserData: (state, action: PayloadAction<UserData | null>) => {
            state.data = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserDataAsync.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.errors = action.payload.errors
        })
    }
})


export const { setIsLoading } = userSlice.actions
export default userSlice.reducer