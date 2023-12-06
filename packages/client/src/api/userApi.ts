import { isAxiosError } from 'axios'
import { api } from '.'

export interface UserData {
    name: string
    email: string
    phone?: string
    birthday?: string
    skype?: string
}

export type GetUserDataResult = {
    success: boolean
    data: UserData | null
    errors: null
}

export const getUserData = async (): Promise<GetUserDataResult> => {
    try {
        const result = await api.get('/user/me')

        return {
            success: true,
            data: result.data,
            errors: null,
        }
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.status === 401) {
                return {
                    success: false,
                    data: null,
                    errors: error?.response?.data?.errors,
                }
            }
        }
        return {
            success: false,
            data: null,
            errors: null,
        }
    }
}
