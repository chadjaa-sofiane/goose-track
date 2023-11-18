import request from 'supertest'
import { describe, it, expect, afterEach, beforeAll, afterAll } from 'bun:test'
import { mongooseConnection, app } from '@/index'
import User from '@/models/user'
import { password } from 'bun'

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

    const path = '/auth/login'

    it('should validate email', async () => {
        const invalidEmailResponses = [
            { email: 'invalid@email', password: 'password123AB!' },
            { email: '@email', password: 'password123AB!' },
            {
                email: 'johndoe@email.com'.repeat(256),
                password: 'password123AB!',
            },
        ]

        for (const invalidEmailData of invalidEmailResponses) {
            const response = await request(app)
                .post(path)
                .send(invalidEmailData)
            expect(response.status).toBe(400)
            expect(response.body.issues).toBeDefined()
            expect(response.body.issues.length).toBeGreaterThanOrEqual(1)
        }
    })

    it('should login an existing user successfully', async () => {
        const user = {
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: 'password123AB!',
        }
        const hashPassword = await password.hash(user.password, {
            algorithm: 'argon2d',
        })

        await new User({ ...user, password: hashPassword }).save()

        const response = await request(app).post(path).send(user)
        expect(response.status).toBe(200) // Expect status code 200 (OK)
        expect(response.body.data).toBeDefined() // Verify data
        expect(response.body.error).toBeNull() // Verify no error
        expect(response.body.token).toBeDefined() // Verify token
        expect(response.body.issues).toBeUndefined() // Verify issues
    })

    it('should not login a non-existent user', async () => {
        const response = await request(app).post(path).send({
            email: 'invalid@email.com',
            password: 'password123AB!',
        })
        expect(response.status).toBe(401) // Expect status code 401 (Unauthorized)
        expect(response.body.error).toBeDefined() // Verify error
    })

    it('should not login with an incorrect password', async () => {
        const user = {
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: 'password123AB!',
        }
        const hashPassword = await password.hash(user.password, {
            algorithm: 'argon2d',
        })

        await new User({ ...user, password: hashPassword }).save()

        const response = await request(app).post(path).send({
            email: 'johndoe@email.com',
            password: 'wrongpassword',
        })
        expect(response.status).toBe(401) // Expect status code 401 (Unauthorized)
        expect(response.body.error).toBeDefined() // Verify error
    })
})
