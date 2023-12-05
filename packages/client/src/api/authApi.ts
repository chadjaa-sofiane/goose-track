import { api } from '.'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import type { ZodIssue } from 'zod'
import { extractErrorsFromIssues, extractMongooseErrors } from '@/lib/utils'
// type path = 'login' | 'register'
// type authPath = `/auth/${path}`

export const loginSchema = z.object({
    email: z.string().email('please provide a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(32, 'Password must be no more than 32 characters long'),
})

export type LoginFields = z.infer<typeof loginSchema>

export type Result<T> = {
    data: unknown
    errors: Partial<T> | null
}
export type Login = (inputs: LoginFields) => Promise<Result<LoginFields> | null>

export const login: Login = async ({ email, password }) => {
    try {
        const result = await api.post('/auth/login', {
            email,
            password,
        })
        return {
            data: result.data,
            errors: null,
        }
    } catch (error) {
        if (isAxiosError(error)) {
            const data = error.response?.data
            return {
                data: null,
                errors: {
                    ...data.errors,
                    ...extractErrorsFromIssues(data?.issues as ZodIssue[]),
                    ...extractMongooseErrors(data?.error),
                },
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

export type Register = (
    inputs: RegisterFields
) => Promise<Result<RegisterFields> | null>

export const register: Register = async ({ name, email, password }) => {
    try {
        const result = await api.post('/auth/register', {
            name,
            email,
            password,
        })
        return {
            data: result.data,
            errors: null,
        }
    } catch (error) {
        if (isAxiosError(error)) {
            const data = error.response?.data
            return {
                data: null,
                errors: {
                    ...data?.errors,
                    ...extractErrorsFromIssues(data?.issues as ZodIssue[]),
                    ...extractMongooseErrors(data?.error),
                },
            }
        }
        return null
    }
}
