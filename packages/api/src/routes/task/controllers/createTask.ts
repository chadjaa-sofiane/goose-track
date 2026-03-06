import Task from '@/models/task'
import { Request, RequestHandler } from 'express'
import { z } from 'zod'

const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/

const parseTime = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number)
    return hours * 60 + minutes
}

export const createTaskSchema = z.object({
    body: z
        .object({
            title: z
                .string()
                .min(5, 'the title should contain at least 5 letters')
                .max(100, 'this title is too long'),
            start: z.string().regex(timeRegex, 'invalid time format'),
            end: z.string().regex(timeRegex, 'invalid time format'),
            priority: z.enum(['low', 'medium', 'high']),
            date: z.string().datetime(),
            container: z.string().min(1).optional(),
        })
        .refine((data) => parseTime(data.end) > parseTime(data.start), {
            message: 'end time cannot be before start time',
            path: ['end'],
        }),
})

type Body = z.infer<typeof createTaskSchema>['body']

export const createTask: RequestHandler = async (
    req: Request<unknown, unknown, Body>,
    res
) => {
    try {
        if (!req.user?._id) {
            return res
                .status(401)
                .json({ data: null, errors: { auth: 'unauthorized' } })
        }

        const task = await Task.create({
            ...req.body,
            userId: req.user._id,
            date: new Date(req.body.date),
        })

        return res.status(201).json({
            success: true,
            data: task,
            errors: null,
        })
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, data: null, errors: error })
    }
}
