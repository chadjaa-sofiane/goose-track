import { RequestHandler } from 'express'
import User from '@/models/user'
import { z } from 'zod'
import { removeFalsyFields } from '@/lib/removeFalsyFields'

export const updateUserDataSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(3, 'Name must be at least 3 characters long')
            .optional(),
        email: z.string().email('Invalid email format').optional(),
        // password: z
        //     .string()
        //     .min(8, 'Password must be at least 8 characters long')
        //     .optional(),
        phone: z
            .string()
            .min(5, 'Phone number must be at least 5 characters long')
            .optional(),
        birthday: z.date().optional().nullable(),
        skype: z
            .string()
            .min(3, 'Skype username must be at least 3 characters long')
            .optional(),
    }),
})

type Body = z.infer<typeof updateUserDataSchema>['body']

export const updateUserData: RequestHandler<unknown, unknown, Body> = async (
    req,
    res
) => {
    const { birthday, email, name, phone, skype } = req.body
    const id = req.user?._id
    try {
        const updateFields = removeFalsyFields({
            birthday,
            email,
            name,
            phone,
            skype,
        })
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                data: null,
                errors: {
                    message: 'no update fields found!',
                },
            })
        }

        const user = await User.updateOne(
            { _id: id },
            { $set: updateFields }
        ).then(() => User.findById(id))

        return res.status(200).json({
            error: null,
            data: user,
        })
    } catch (error) {
        res.status(500).json(error)
    }
}
