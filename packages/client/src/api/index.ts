import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

export type SuccessResult<D> = {
    success: true
    data: D
    errors: null
}

export type FailedResult<E> = {
    success: false
    data: null
    errors: E | null
}

export type Response<D, E = D> = SuccessResult<D> | FailedResult<E>
