import { Router } from 'express'
import passport from 'passport'
import { getUserData } from './controllers/getUserData'
import { getUserById, getUserByIdSchema } from './controllers/getUserById'
import validate from '@/middlewares/validate'
import {
    updateUserDataSchema,
    updateUserData,
} from './controllers/updateUserData'

const userRouter = Router()

userRouter.get(
    '/me',
    passport.authenticate('jwt', { session: false }),
    getUserData
)
userRouter.get(
    '/:id',
    validate(getUserByIdSchema),
    passport.authenticate('jwt', { session: false }),
    getUserById
)

userRouter.put(
    '/update',
    validate(updateUserDataSchema),
    passport.authenticate('jwt', { session: false }),
    updateUserData
)

export default userRouter
