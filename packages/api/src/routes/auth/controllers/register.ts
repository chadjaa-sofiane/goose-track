import { RequestHandler, Request } from 'express'
import { password } from 'bun'
import User from '@/models/user'

import { z } from 'zod'
import { generateJwtToken } from '@/lib/jsonWebToken'

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
    body: z.object({
        name: z.string().min(3).max(50),
        email: z.string().email(),
        password: strongPasswordSchema,
    }),
})

type Body = z.infer<typeof registerSchema>['body']

export const register: RequestHandler = async (
    req: Request<unknown, unknown, Body>,
    res
) => {
    const { email, name, password: userPassword } = req.body
    try {
        const hashPassword = await password.hash(userPassword, {
            algorithm: 'argon2d',
        })
        const user = new User({
            name,
            email,
            password: hashPassword,
        })

        try {
            const savedUser = await user.save()
            const jwtToken = generateJwtToken({
                _id: savedUser._id,
                name,
                email,
            })
            res.cookie('access_token', jwtToken, {
                httpOnly: true,
            })
            return res.status(201).json({
                error: null,
                data: {
                    _id: savedUser._id,
                },
            })
        } catch (error) {
            return res.status(409).json({ error, data: null })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
