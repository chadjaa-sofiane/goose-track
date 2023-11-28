export {}
declare global {
    namespace Express {
        interface User {
            _id: string
            email: string
            name: string
            createdAt: string
            updatedAt: string
            __v: string
        }
    }
}
