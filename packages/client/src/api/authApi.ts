import ApiService, { type Response } from '.'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import type { ZodIssue } from 'zod'
import { extractErrorsFromIssues, extractMongooseErrors } from '@/lib/utils'

const apiV1 = ApiService.getApiInstance('v1')

export const loginSchema = z.object({
    email: z.string().email('please provide a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(32, 'Password must be no more than 32 characters long'),
})

export type LoginFields = z.infer<typeof loginSchema>

export type LoginResponse = Response<LoginFields> | null

export type Login = (inputs: LoginFields) => Promise<LoginResponse>

export const login: Login = async ({ email, password }) => {
    try {
        const result = await apiV1.post<{ data: LoginFields }>('/auth/login', {
            email,
            password,
        })

        return {
            success: true,
            data: result.data.data,
            errors: null,
        }
    } catch (error) {
        if (isAxiosError(error)) {
            const data = error.response?.data
            return {
                success: false,
                data: null,
                errors: {
                    ...data.errors,
                    ...extractErrorsFromIssues(data?.issues as ZodIssue[]),
                    ...extractMongooseErrors(data?.error),
                } as LoginFields,
            }
        }
        return null
    }
}

const strongPasswordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be no more than 32 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
        /[-+=*&@#%$!^()/,\]{}|?><:.]/,
        'Password must contain at least one special character'
    )

export const registerSchema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().email('please provide a valid email address'),
    password: strongPasswordSchema,
})

export type RegisterFields = z.infer<typeof registerSchema>

export type RegisterResponse = Response<RegisterFields> | null

export type Register = (inputs: RegisterFields) => Promise<RegisterResponse>

export const register: Register = async ({ name, email, password }) => {
    try {
        const result = await apiV1.post<{ data: RegisterFields }>(
            '/auth/register',
            {
                name,
                email,
                password,
            }
        )
        return {
            success: true,
            data: result.data.data,
            errors: null,
        }
    } catch (error) {
        if (isAxiosError(error)) {
            const data = error.response?.data
            return {
                success: false,
                data: null,
                errors: {
                    ...data.errors,
                    ...extractErrorsFromIssues(data?.issues as ZodIssue[]),
                    ...extractMongooseErrors(data?.error),
                } as RegisterFields,
            }
        }
        return null
    }
}

export const logout = async () => {
    try {
        await apiV1.post('/auth/logout')
        return false
    } catch (error) {
        return true
    }
}
