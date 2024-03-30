import { it, describe, expect } from 'bun:test'
import mongoose from 'mongoose'
import { generateJwtToken, verifyJwtToken } from '../jsonWebToken'

describe('generateJwtToken', () => {
    it('should generate a valid JWT token', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId(),
            email: 'johndoe@example.com',
            name: 'John Doe',
        }
        const token = generateJwtToken(payload)
        expect(token).toBeTruthy()
        const result = verifyJwtToken(token!)

        expect(result).toEqual({
            sub: payload._id.toString(),
            email: payload.email,
            name: payload.name,
            iat: expect.any(Number) as unknown as number,
            exp: expect.any(Number) as unknown as number,
        })
    })
})
