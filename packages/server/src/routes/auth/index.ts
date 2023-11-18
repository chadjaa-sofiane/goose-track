import validate from '@/middlewares/validate'
import { Router } from 'express'
import { loginSchema, login } from './controllers/login'
import { registerSchema, register } from './controllers/register'

const authRouter = Router()

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)

export default authRouter
