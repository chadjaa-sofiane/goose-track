import { RequestHandler } from 'express'
import User from '@/models/user'
import { z } from 'zod'
import { Types } from 'mongoose'

export const getUserByIdSchema = z.object({
    params: z.object({
        id: z
            .string()
            .refine(
                (value) => Types.ObjectId.isValid(value),
                'please provide a valid mongodb Id'
            ),
    }),
})

type Params = z.infer<typeof getUserByIdSchema>['params']

export const getUserById: RequestHandler<Params> = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password')

        if (!user) {
            return res.status(404).json({
                data: null,
                errors: { id: "User doesn't exist" },
            })
        }
        return res.status(200).json({
            error: null,
            data: user,
        })
    } catch (error) {
        res.status(500).json(error)
    }
}
