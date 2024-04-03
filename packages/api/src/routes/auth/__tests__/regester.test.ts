import request from 'supertest'
import { describe, it, expect, afterAll, beforeAll, afterEach } from 'bun:test'
import { mongooseConnection, app } from '@/index'
import User from '@/models/user'
import { password } from 'bun'

describe('Register API', () => {
    beforeAll(async () => {
        await mongooseConnection.connect()
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    afterAll(async () => {
        await mongooseConnection.disconnect()
    })

    const path = '/auth/register'

    it('should validate name', async () => {
        const invalidNameResponses = [
            {
                name: '',
                email: 'johndoe@email.com',
                password: 'password123AB!',
            },
            {
                name: 'J',
                email: 'johndoe@email.com',
                password: 'password123AB!',
            },
            {
                name: 'John Doe'.repeat(51),
                email: 'johndoe@email.com',
                password: 'password123',
            },
        ]

        for (const invalidNameData of invalidNameResponses) {
            const response = await request(app).post(path).send(invalidNameData)
            expect(response.status).toBe(400)
            expect(response.body.issues).toBeDefined()
            expect(response.body.issues.length).toBeGreaterThanOrEqual(1)
        }
    })

    it('should validate email', async () => {
        const invalidEmailResponses = [
            {
                name: 'John Doe',
                email: 'invalid@email',
                password: 'password123',
            },
            { name: 'John Doe', email: '@email', password: 'password123AB!' },
            {
                name: 'John Doe',
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

    it('should validate password', async () => {
        const invalidPasswordResponses = [
            { name: 'John Doe', email: 'johndoe@email.com', password: '123' },
            {
                name: 'John Doe',
                email: 'johndoe@email.com',
                password: 'password',
            },
            {
                name: 'John Doe',
                email: 'johndoe@email.com',
                password: 'password1234567890'.repeat(3),
            },
        ]

        for (const invalidPasswordData of invalidPasswordResponses) {
            const response = await request(app)
                .post(path)
                .send(invalidPasswordData)
            expect(response.status).toBe(400)
            expect(response.body.issues).toBeDefined()
            expect(response.body.issues.length).toBeGreaterThanOrEqual(1)
        }
    })

    it('should register a new user successfully', async () => {
        const response = await request(app).post(path).send({
            // a valid name
            name: 'John Doe',
            // a valid email
            email: 'johndoe@email.com',
            // a valid password
            password: 'password123AB!',
        })
        expect(response.status).toBe(201) // Expect status code 201 (Created)
        expect(response.body.data).toBeDefined() // Verify data
        expect(response.body.error).toBeNull() // Verify no error
        // expect(response.body.token).toBeDefined() // Verify token
        expect(response.body.issues).toBeUndefined() // Verify issues
    })

    it('should not register an existing user', async () => {
        const user = {
            name: 'John Doe',
            email: 'johndoe@email.com', // User already exists
            password: 'password123AB!',
        }
        const hashPassword = await password.hash(user.password, {
            algorithm: 'argon2d',
        })

        await new User({ ...user, password: hashPassword }).save()

        const response = await request(app).post(path).send(user)
        expect(response.status).toBe(409) // Expect status code 409 (Conflict)
        expect(response.body.error).toBeDefined() // Verify error
    })
})
