import {
    type LoginFields,
    type RegisterFields,
    login,
    register,
    logout,
    LoginResponse,
    RegisterResponse,
} from '@/api/authApi'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    // you can do this too: loginResponse: Awaited<ReturnType<typeof login>>
    isLoggedIn: boolean
    isBootstrapped: boolean
    loginResponse: LoginResponse
    registerResponse: RegisterResponse
}

const initialState: AuthState = {
    isLoggedIn: false,
    isBootstrapped: false,
    loginResponse: null,
    registerResponse: null,
}

export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials: LoginFields) => {
        return await login(credentials)
    }
)

export const registerAsync = createAsyncThunk(
    'auth/register',
    async (credentials: RegisterFields) => {
        return await register(credentials)
    }
)

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
    return await logout()
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        cleanLoginResponse: (state) => {
            state.loginResponse = null
        },
        cleanRegisterResponse: (state) => {
            state.registerResponse = null
        },
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        },
        setAuthBootstrapped: (state, action: PayloadAction<boolean>) => {
            state.isBootstrapped = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginAsync.fulfilled, (state, action) => {
            state.loginResponse = action.payload
            if (action.payload?.success) {
                state.isLoggedIn = true
            }
            state.isBootstrapped = true
        })
        builder.addCase(registerAsync.fulfilled, (state, action) => {
            state.registerResponse = action.payload
            if (action.payload?.success) {
                state.isLoggedIn = true
            }
            state.isBootstrapped = true
        })
        builder.addCase(logoutAsync.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload
            state.isBootstrapped = true
        })
    },
})

export const {
    cleanLoginResponse,
    cleanRegisterResponse,
    setIsLoggedIn,
    setAuthBootstrapped,
} = authSlice.actions
export default authSlice.reducer
