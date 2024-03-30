import config from '@/configs/config'
// todo: jsonwebtoken library needs to be upgraded to the latest version once it is compatable with bun.
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

export type Payload = {
    sub: string
    email: string
    name: string
    iss?: string
    iat?: number
    aud?: string
    exp?: number
    jti?: string
}

export const generateJwtToken = (user: {
    _id: Types.ObjectId
    email: string
    name: string
}) => {
    // Assuming user contains necessary information for token paylo ad
    const payload = {
        sub: user._id,
        iat: Date.now(),
        email: user.email,
        name: user.name,
    }

    // Set the token expiration time as needed
    const expiresIn = '1h'

    // Generate the JWT token
    try {
        const token = jwt.sign(payload, config.privateJwtKey, {
            expiresIn,
            algorithm: 'RS256',
        })
        return token
    } catch (error) {
        console.error(
            `Error generating JWT token: ${
                (error as { message: string }).message
            }`
        )
        return null
    }
}

export const verifyJwtToken = (token: string | null): Payload | null => {
    if (!token) return null
    try {
        const payload = jwt.verify(token, config.publicJwtKey, {
            algorithms: ['RS256'],
        })
        return payload as unknown as Payload
    } catch (error) {
        console.error(
            `Error verifying JWT token: ${
                (error as { message: string }).message
            }`
        )
        return null
    }
}
