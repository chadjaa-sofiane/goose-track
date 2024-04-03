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

    const path = '/user/:id'

    it('should not accept invalid user id', async () => {
        const invalidUserIds = [
            {
                id: 'invalidId',
            },
            {
                id: '1234',
            },
            {
                id: '65649f037aa9d9348c30da6a44+thoutih',
            },
        ]
        for (const invalidUserId of invalidUserIds) {
            const id = invalidUserId.id
            const response = await request(app).get(path.replace(':id', id))
            expect(response.status).toEqual(400)
            expect(response.body.issues).toBeDefined()
            expect(response.body.issues.length).toBeGreaterThanOrEqual(1)
            expect(response.body.errors).toBeUndefined()
            expect(response.body.data).toBeUndefined()
        }
    })

    it('should not allowed requester to get user data, unAuthorized', async () => {
        const user = {
            name: 'John Doe',
            email: 'johndoe@email.com', // User already exists
            password: 'password123AB!',
        }
        const hashPassword = await password.hash(user.password, {
            algorithm: 'argon2d',
        })
        const savedUser = new User({
            ...user,
            password: hashPassword,
        })
        const { _id: id } = savedUser
        const response = await request(app).get(
            path.replace(':id', id.toString())
        )
        expect(response.status).toEqual(401)
    })

    it('should return the user with same id and without the password', async () => {
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

        const { _id: id } = savedUser
        const response = await request(app)
            .get(path.replace(':id', id.toString()))
            .set('Cookie', `access_token=${jwtToken}`)

        expect(response.status).toEqual(200)
        expect(response.body.data).toBeDefined()
        expect(response.body.data.name).toEqual(savedUser.name)
        expect(response.body.data.email).toEqual(savedUser.email)
        expect(response.body.data.password).toBeUndefined()
    })
})
