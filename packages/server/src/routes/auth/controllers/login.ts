import { RequestHandler, Request } from 'express'
import { password } from 'bun'
import User from '@/models/user'

import { z } from 'zod'
import { generateJwtToken } from '@/lib/jsonWebToken'

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
    }),
})

type Body = z.infer<typeof loginSchema>['body']

export const login: RequestHandler = async (
    req: Request<unknown, unknown, Body>,
    res
) => {
    const { email, password: userPassword } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res
                .status(401)
                .json({ data: null, user: "User doesn't exist" })
        }

        const passwordMatch = await password.verify(userPassword, user.password)
        if (!passwordMatch) {
            return res
                .status(401)
                .json({ data: null, password: 'Invalid email or password' })
        }

        const jwtToken = generateJwtToken({
            _id: user._id,
            name: user.name,
            email: user.email,
        })

        return res.status(200).json({
            error: null,
            data: {
                _id: user._id,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                email: user.email,
                name: user.name,
            },
            token: jwtToken,
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}
