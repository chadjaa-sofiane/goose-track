import { RequestHandler } from 'express'

export const logout: RequestHandler = (_, res) => {
    try {
        res.clearCookie('access_token')
        return res.status(200).json(null)
    } catch (error) {
        res.status(500).json(error)
    }
}
