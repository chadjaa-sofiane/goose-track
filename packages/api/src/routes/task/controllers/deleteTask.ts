import Task from '@/models/task'
import { RequestHandler } from 'express'
import { z } from 'zod'

export const deleteTaskSchema = z.object({
    params: z.object({
        id: z.string().min(1),
    }),
})

type Params = z.infer<typeof deleteTaskSchema>['params']

export const deleteTask: RequestHandler<Params> = async (req, res) => {
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

        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            userId,
        })

        if (!deletedTask) {
            return res
                .status(404)
                .json({
                    success: false,
                    data: null,
                    errors: { task: 'task not found' },
                })
        }

        return res
            .status(200)
            .json({ success: true, data: deletedTask, errors: null })
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, data: null, errors: error })
    }
}
