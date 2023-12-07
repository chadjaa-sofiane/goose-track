import request from 'supertest'
import { describe, it, expect, afterEach, beforeAll, afterAll } from 'bun:test'
import { mongooseConnection, app } from '@/index'
import User from '@/models/user'
import { password } from 'bun'
import { generateJwtToken } from '@/lib/jsonWebToken'
import cookieParser from 'cookie-parser'

describe('Login API', () => {
    beforeAll(async () => {
        await mongooseConnection.connect()
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    afterAll(async () => {
        await mongooseConnection.disconnect()
    })

    const path = '/auth/logout'

    it('should return 401 error code, unAuthorized access', async () => {
        const response = await request(app).post(path)

        expect(response.statusCode).toBe(401)
    })

    it('should logout and make the user unAuthorized', async () => {
        const user = {
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: 'password123AB!',
        }
        const hashPassword = await password.hash(user.password, {
            algorithm: 'argon2d',
        })

        const savedUser = await new User({
            ...user,
            password: hashPassword,
        }).save()

        const jwtToken = generateJwtToken({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
        })

        const response = await request(app)
            .post(path)
            .set('Cookie', `access_token=${jwtToken}`)
            
        expect(response.statusCode).toEqual(200)
        // expect().toBeEmpty()
    })
})
