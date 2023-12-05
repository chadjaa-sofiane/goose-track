import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserData {
    name: string
    email: string
    phone?: string
    birthday?: string
    skype?: string
}

type UserStates = {
    isLoading: boolean
    isLogin: boolean
    data: UserData | null
}

const initialState: UserStates = {
    isLoading: false,
    isLogin: false,
    data: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        },
        setUserData: (state, action: PayloadAction<UserData | null>) => {
            state.data = action.payload
        }
    }
})


export const { setIsLoading, setIsLogin } = userSlice.actions
export default userSlice.reducer