import validate from '@/middlewares/validate'
import { Router } from 'express'
import { loginSchema, login } from './controllers/login'
import { registerSchema, register } from './controllers/register'
import passport from 'passport'
import { logout } from './controllers/logout'

const authRouter = Router()

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)
authRouter.post(
    '/logout',
    passport.authenticate('jwt', { session: false }),
    logout
)

export default authRouter
