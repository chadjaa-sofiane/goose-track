import { parseTime } from '@/lib/utils'
import { priorites } from '@/redux/calendarSlice'
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
