import axios, { AxiosInstance } from 'axios'
const BASE_URL_v1 =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

class ApiService {
    private static instances: { [version: string]: AxiosInstance } = {}
    private static createInstance(baseURL: string) {
        const instance = axios.create({
            baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return instance
    }
    public static getApiInstance(version: string) {
        const instanceVersion = ApiService.instances[version]
        if (instanceVersion) {
            return instanceVersion
        }

        let baseURL
        switch (version) {
            case 'v1':
                baseURL = BASE_URL_v1
                break
            default:
                throw new Error(`UnSupported API version: ${version}`)
        }
        const instance = ApiService.createInstance(baseURL)
        ApiService.instances[version] = instance
        return instance
    }
}

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

export default ApiService
