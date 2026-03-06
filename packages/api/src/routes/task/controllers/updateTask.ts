import Task from '@/models/task'
import { RequestHandler } from 'express'
import { z } from 'zod'

const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/

const parseTime = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number)
    return hours * 60 + minutes
}

export const updateTaskSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
    body: z
        .object({
            title: z
                .string()
                .min(5, 'the title should contain at least 5 letters')
                .max(100, 'this title is too long')
                .optional(),
            start: z
                .string()
                .regex(timeRegex, 'invalid time format')
                .optional(),
            end: z.string().regex(timeRegex, 'invalid time format').optional(),
            priority: z.enum(['low', 'medium', 'high']).optional(),
            date: z.string().datetime().optional(),
            container: z.string().min(1).optional(),
        })
        .refine(
            (data) => {
                if (!data.start || !data.end) return true
                return parseTime(data.end) > parseTime(data.start)
            },
            {
                message: 'end time cannot be before start time',
                path: ['end'],
            }
        ),
})

type Params = z.infer<typeof updateTaskSchema>['params']
type Body = z.infer<typeof updateTaskSchema>['body']

export const updateTask: RequestHandler<Params, unknown, Body> = async (
    req,
    res
) => {
    try {
        const userId = req.user?._id
        if (!userId) {
            return res
                .status(401)
                .json({
                    success: false,
                    data: null,
                    errors: { auth: 'unauthorized' },
                })
        }

        const updates: Record<string, unknown> = { ...req.body }
        if (req.body.date) {
            updates.date = new Date(req.body.date)
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId },
            { $set: updates },
            { new: true }
        )

        if (!task) {
            return res
                .status(404)
                .json({
                    success: false,
                    data: null,
                    errors: { task: 'task not found' },
                })
        }

        return res.status(200).json({ success: true, data: task, errors: null })
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, data: null, errors: error })
    }
}
