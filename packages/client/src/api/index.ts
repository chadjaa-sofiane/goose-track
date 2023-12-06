import axios from 'axios'
// import type { AxiosResponse, AxiosError } from 'axios'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

console.log('this is the base URL', BASE_URL)

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add an interceptor for global error handling
// api.interceptors.response.use(
//     (response: AxiosResponse) => response,
//     (error: AxiosError) => {
//         // Handle error globally
//         if (error.code === 'ECONNREFUSED') {
//             console.error('Network error:', error)
//             return Promise.reject(error)
//         }
//         if (error.status === 400) {
//             console.error('API request error:', error)
//             return Promise.reject(error)
//         }
//         if (error.status === 500) {
//             console.error('API request error:', error)
//             return Promise.reject(error)
//         }
//     }
// )
