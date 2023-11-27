import type { PassportStatic } from 'passport'
import { Strategy as JwtStategy, StrategyOptions } from 'passport-jwt'
import config from '../config'
import User from '@/models/user'
import { Payload } from '@/lib/jsonWebToken'
import { Request } from 'express'

const cookieExtractor = (req: Request) => {
    if (req && req.cookies) {
        return req.cookies['access_token']
    }
}

const jwtOptions: StrategyOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.publicJwtKey,
    algorithms: ['RS256'],
}

const jwtPassport = (passport: PassportStatic) => {
    passport.use(
        new JwtStategy(jwtOptions, async (payload: Payload, done) => {
            const { sub } = payload
            try {
                const user = await User.findOne({
                    _id: sub,
                })
                if (user) {
                    return done(null, true)
                }
                return done(null, false)
            } catch (error) {
                done(error, undefined)
            }
        })
    )
}

export default jwtPassport
