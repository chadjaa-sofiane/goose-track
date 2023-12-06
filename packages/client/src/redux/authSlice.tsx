import { type LoginFields, type RegisterFields, type Result, login, register } from "@/api/authApi"
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    // you can do this too: loginResult: Awaited<ReturnType<typeof login>>
    isLoggedIn: boolean
    loginResult: Result<LoginFields> | null
    registerResult: Result<RegisterFields> | null
}

const initialState: AuthState = {
    isLoggedIn: false,
    loginResult: null,
    registerResult: null
}

export const loginAsync = createAsyncThunk('auth/login', async (credentials: LoginFields) => {
    return await login(credentials);
});

export const registerAsync = createAsyncThunk("auth/register", async (credentials: RegisterFields) => {
    return await register(credentials);
})


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        cleanLoginResult: (state) => {
            state.loginResult = null;
        },
        cleanRegisterResult: (state) => {
            state.registerResult = null;
        },
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginAsync.fulfilled, (state, action) => {
            state.loginResult = action.payload
            if (action.payload?.success) {
                state.isLoggedIn = true
            }
        })
        builder.addCase(registerAsync.fulfilled, (state, action) => {
            state.registerResult = action.payload
            if (action.payload?.success) {
                state.isLoggedIn = true
                
            }
        })
    }
})

export const { cleanLoginResult, cleanRegisterResult, setIsLoggedIn } = authSlice.actions
export default authSlice.reducer