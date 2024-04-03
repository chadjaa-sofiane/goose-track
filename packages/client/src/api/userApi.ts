import { isAxiosError } from 'axios'
import ApiService, { Response } from '.'
import { extractErrorsFromIssues } from '@/lib/utils'
import { ZodIssue, z } from 'zod'

const apiV1 = ApiService.getApiInstance('v1')

export interface UserFields {
    name: string
    email: string
    phone?: string
    birthday?: string
    skype?: string
}

export type ReturnedUserData = {
    _id: string
    createdAt: string
    updatedAt: string
} & UserFields

export type GetUserDataResponse = Response<ReturnedUserData, UserFields>

export const getUserData = async (): Promise<GetUserDataResponse> => {
    try {
        const result = await apiV1.get<{ user: ReturnedUserData }>('/user/me')

        return {
            success: true,
            data: result.data.user,
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

const stringPreProcess = (name: unknown) => {
    if (!name || typeof name !== 'string') return undefined
    return name.trim() === '' ? undefined : name
}

export const updateUserSchema = z.object({
    name: z.preprocess(
        stringPreProcess,
        z.string().min(3, 'Name must be at least 3 characters long').optional()
    ),
    email: z.preprocess(
        stringPreProcess,
        z.string().email('Invalid email format').optional()
    ),
    phone: z.preprocess(
        stringPreProcess,
        z
            .string()
            .regex(
                /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                'please provide a valid phone number'
            )
            .optional()
    ),
    birthday: z.preprocess(
        stringPreProcess,
        z.coerce
            .date()
            .transform((date) => date.toISOString())
            .optional()
            .nullable()
    ),
    skype: z.preprocess(
        stringPreProcess,
        z
            .string()
            .min(3, 'Skype username must be at least 3 characters long')
            .optional()
    ),
})

export type UpdateUserFields = z.infer<typeof updateUserSchema>

export type UpdateUserDataInputs = Partial<UpdateUserFields>
export type UpdateUserDataResponse = Response<
    ReturnedUserData,
    UpdateUserFields
>

export const updateUserData = async (
    inputs?: UpdateUserDataInputs
): Promise<UpdateUserDataResponse> => {
    try {
        const result = await apiV1.put<{ data: ReturnedUserData }>(
            'user/update',
            inputs
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
                    ...extractErrorsFromIssues(data?.issues as ZodIssue[]),
                } as UpdateUserFields,
            }
        }
    }
    return {
        success: false,
        data: null,
        errors: null,
    }
}
