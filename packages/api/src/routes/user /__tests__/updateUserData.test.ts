import request from 'supertest'
import { it, describe, expect, beforeAll, afterEach, afterAll } from 'bun:test'
import { app, mongooseConnection } from '@/index'
import User from '@/models/user'
import { password } from 'bun'
import { generateJwtToken } from '@/lib/jsonWebToken'

describe('updateUserData', () => {
    beforeAll(async () => {
        await mongooseConnection.connect()
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    afterAll(async () => {
        await mongooseConnection.disconnect()
    })

    const path = '/user/update'

    it('should update user data', async () => {
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
            .put(path)
            .set('Cookie', `access_token=${jwtToken}`)
            .send({
                name: 'John not Doe',
            })
        const newUser = await User.findById(savedUser._id)
        expect(response.status).toEqual(200)
        expect(response.body.data).toBeDefined()
        expect(newUser?.name).toEqual('John not Doe')
    })

    it('should only update the user data and not the other useres', async () => {
        const user1 = {
            name: 'John 1',
            email: 'johndoe_1@email.com', // User already exists
            password: 'password123AB!',
        }
        const user2 = {
            name: 'John 2',
            email: 'johndoe_2@email.com', // User already exists
            password: 'password123AB!',
        }

        const hashPassword1 = await password.hash(user1.password, {
            algorithm: 'argon2d',
        })
        const hashPassword2 = await password.hash(user2.password, {
            algorithm: 'argon2d',
        })

        const savedUser1 = await new User({
            ...user1,
            password: hashPassword1,
        }).save()
        const savedUser2 = await new User({
            ...user2,
            password: hashPassword2,
        }).save()

        const jwtToken = generateJwtToken({
            _id: savedUser1._id,
            name: savedUser1.name,
            email: savedUser1.email,
        })

        const response = await request(app)
            .put(path)
            .set('Cookie', `access_token=${jwtToken}`)
            .send({
                name: 'John not Doe',
            })
        const user2Data = await User.findById(savedUser2._id)
        expect(response.status).toEqual(200)
        expect(response.body.data).toBeDefined()
        expect(user2Data?.name).toEqual('John 2')
        expect(user2Data?.email).toEqual('johndoe_2@email.com')
        // expect(user2Data?.password).toBeUndefined()
    })

    it('should not be able to update when unlisted fields exists!', async () => {
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
            .put(path)
            .set('Cookie', `access_token=${jwtToken}`)
            .send({
                password: 'something else',
            })

        expect(response.status).toEqual(400)
        expect(response.body.errors.message).toBeDefined()
        expect(response.body.data).toBeNull()
    })

    it('invalid access token, it should not update user data', async () => {
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

        const response = await request(app).put(path).send({
            name: 'John not Doe',
        })

        const UserData = await User.findById(savedUser._id)
        expect(response.status).toBe(401)
        expect(UserData?.name).toEqual(savedUser.name)
    })

    it('should not update due to invalid inputs', async () => {
        const invalidInputs = [
            // Invalid name (less than 3 characters)
            {
                name: 'Jo',
            },
            // Invalid email format
            {
                email: 'invalidEmail',
            },
            // Invalid phone number (less than 5 characters)
            {
                phone: '1234',
            },
            // Invalid Skype username (less than 3 characters)
            {
                skype: 'Sk',
            },
            // Invalid birthday format
            {
                birthday: 'invalidDate',
            },
            // Invalid birthday value (should be null or a valid date)
            {
                birthday: '2020-01-01',
            },
        ]

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

        for (const input of invalidInputs) {
            const response = await request(app)
                .put(path)
                .set('Cookie', `access_token=${jwtToken}`)
                .send(input)
            expect(response.status).toBe(400)

            expect(response.body.issues).toBeDefined()
            expect(response.body.issues.length).toBeGreaterThanOrEqual(1)
            expect(response.body.errors).toBeUndefined()
            expect(response.body.data).toBeUndefined()
        }
    })

    it('should validate the time input', async () => {
        const birthdayInupts = [
            {
                // too old
                inputs: { birthday: '1889-01-12T00:00:00.000Z' },
                statusCode: 400,
            },
            {
                // too young
                inputs: { birthday: '2020-01-12T00:00:00.000Z' },
                statusCode: 400,
            },
            {
                // a valid age
                inputs: { birthday: '2010-01-12T00:00:00.000Z' },
                statusCode: 200,
            },
        ]

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

        for (const input of birthdayInupts) {
            const response = await request(app)
                .put(path)
                .set('Cookie', `access_token=${jwtToken}`)
                .send(input.inputs)

            expect(response.statusCode).toEqual(input.statusCode)
            switch (input.statusCode) {
                case 400:
                    expect(response.body.issues.length).toBeGreaterThanOrEqual(
                        1
                    )
                    expect(response.body.errors).toBeUndefined()
                    expect(response.body.data).toBeUndefined()
                    break
                case 200:
                    expect(response.body.issues).toBeUndefined()
                    expect(new Date(response.body.data.birthday)).toBeDate()
                    expect(new Date(response.body.data.birthday)).toEqual(
                        new Date(input.inputs.birthday)
                    )
            }
        }
    })
})
