import request from 'supertest'
import { it, describe, expect, beforeAll, afterEach, afterAll } from 'bun:test'
import { app, mongooseConnection } from '@/index'
import User from '@/models/user'
import { password } from 'bun'
import { generateJwtToken } from '@/lib/jsonWebToken'

describe('getUserById', () => {
    beforeAll(async () => {
        await mongooseConnection.connect()
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    afterAll(async () => {
        await mongooseConnection.disconnect()
    })

    const path = '/user/me'

    it('should return user data', async () => {
        const user = {
            name: 'John Doe',
            email: 'johndoe@email.com', // User already exists
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
            .get(path)
            .set('Cookie', `access_token=${jwtToken}`)
        expect(response.status).toEqual(200)
        expect(response.body.user).toBeDefined()
        expect(response.body.user._id).toEqual(savedUser._id.toString())
        expect(response.body.user.name).toEqual(savedUser.name)
        expect(response.body.user.email).toEqual(savedUser.email)
        expect(response.body.password).toBeUndefined()
    })

    it('should not allow the user to get data, unAuthorized access', async () => {
        const response = await request(app).get(path)
        expect(response.status).toBe(401)
    })
})
