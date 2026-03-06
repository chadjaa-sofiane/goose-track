import { parseTime } from '@/lib/utils'
import { priorites } from '@/redux/calendarSlice'
import ApiService, { type Response } from '.'
import { z } from 'zod'

const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/

const validTimeRange = (start: string, end: string) => {
    const parsedStart = parseTime(start) // Use a time parsing library
    const parsedEnd = parseTime(end)
    return parsedEnd > parsedStart
}

const validTime = (value: string) => {
    if (!timeRegex.test(value)) {
        throw new Error('Invalid time format.')
    }
    return true
}

export const taskFormSchema = z
    .object({
        title: z
            .string()
            .min(5, 'the title should contain at least 5 letters')
            .max(100, 'this title is to long'),
        start: z.string().refine(validTime),
        end: z.string().refine(validTime),
    })
    .refine((data) => validTimeRange(data.start, data.end), {
        message: 'End time cannot be before start time',
        path: ['start'],
    })

export type TaskFormFields = z.infer<typeof taskFormSchema> & {
    priority: (typeof priorites)[number]
}

export const uploadTaskSchema = z.intersection(
    taskFormSchema,
    z.object({
        priority: z.enum(['low', 'medium', 'high']),
        date: z.string().datetime(),
        container: z.string().optional(),
    })
)

export type UploadTaskFields = z.infer<typeof uploadTaskSchema>

type UploadTaskResponse = {
    _id: string
    title: string
    start: string
    end: string
    priority: (typeof priorites)[number]
    date: string
    container: string
    userId: string
    createdAt: string
    updatedAt: string
}

type UpdateTaskResponse = UploadTaskResponse
type DeleteTaskResponse = UploadTaskResponse

export const isPersistedTaskId = (id: string) => /^[a-f0-9]{24}$/i.test(id)

export const uploadTask = async (inputs: UploadTaskFields) => {
    const api = ApiService.getApiInstance('v1')
    const response = await api.post<Response<UploadTaskResponse>>(
        '/tasks',
        inputs
    )
    return response.data
}

export type UpdateTaskFields = Partial<UploadTaskFields>

export const updateTaskById = async (
    taskId: string,
    inputs: UpdateTaskFields
) => {
    const api = ApiService.getApiInstance('v1')
    const response = await api.patch<Response<UpdateTaskResponse>>(
        `/tasks/${taskId}`,
        inputs
    )
    return response.data
}

export const deleteTaskById = async (taskId: string) => {
    const api = ApiService.getApiInstance('v1')
    const response = await api.delete<Response<DeleteTaskResponse>>(
        `/tasks/${taskId}`
    )
    return response.data
}
