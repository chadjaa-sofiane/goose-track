import express from 'express'
import chalk from 'chalk'
import config from '@/configs/config'
import createMongoose from '@/configs/db'
import authRouter from '@/routes/auth'
import passport from 'passport'
import jwtPassport from './configs/passport/jwt'
import cors from 'cors'

export const mongooseConnection = createMongoose()
config.env !== 'test' && (await mongooseConnection.connect())
// await mongooseConnection.disconnect()

export const app = express()

// app middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// passport middlewares
jwtPassport(passport)
app.use(passport.initialize())

// the routers
app.use('/auth', authRouter)

app.get(
    '/protected-route',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: 'Access granted' })
    }
)

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
