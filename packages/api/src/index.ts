import express from 'express'
import chalk from 'chalk'
import config from '@/configs/config'
import createMongoose from '@/configs/db'
import authRouter from '@/routes/auth'
import userRouter from './routes/user '
import taskRouter from '@/routes/task'
import passport from 'passport'
import jwtPassport from './configs/passport/jwt'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { existsSync } from 'node:fs'

import cors from 'cors'

export const mongooseConnection = createMongoose()
config.env !== 'test' && (await mongooseConnection.connect())
// await mongooseConnection.disconnect()

export const app = express()

// app middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        credentials: true,
        origin:
            config.env === 'production'
                ? true
                : process.env.CORS_ORIGIN || 'http://localhost:5173',
    })
)
app.use(cookieParser())

// passport middlewares
jwtPassport(passport)
app.use(passport.initialize())

// the routers
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/tasks', taskRouter)

if (config.env === 'production') {
    const clientDistPath = path.resolve(process.cwd(), '../client/dist')

    if (existsSync(clientDistPath)) {
        app.use(express.static(clientDistPath))
        app.get('*', (req, res, next) => {
            if (req.path.startsWith('/api/')) {
                return next()
            }
            return res.sendFile(path.join(clientDistPath, 'index.html'))
        })
    }
}

config.env !== 'test' &&
    app.listen(config.port, () => {
        console.log(
            chalk.blueBright(
                `the server is working on PORT: ${config.hostname}:${config.port}`
            )
        )
    })

process.on('uncaughtException', (error) => {
    console.error(chalk.red('uncaught exception:', error))
    process.exit(1)
})
