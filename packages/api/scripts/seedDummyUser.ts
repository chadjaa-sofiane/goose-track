import createMongoose from '@/configs/db'
import User from '@/models/user'
import { password } from 'bun'

const DUMMY_USER = {
    name: 'OrbitFlow Demo',
    email: 'demo@orbitflow.app',
    password: 'DemoUser123!',
}

const seedDummyUser = async () => {
    const mongooseConnection = createMongoose()

    try {
        await mongooseConnection.connect()
        const hashPassword = await password.hash(DUMMY_USER.password, {
            algorithm: 'argon2d',
        })

        const existingUser = await User.findOne({ email: DUMMY_USER.email })

        if (existingUser) {
            existingUser.name = DUMMY_USER.name
            existingUser.password = hashPassword
            await existingUser.save()
            console.log(`Updated demo user: ${DUMMY_USER.email}`)
        } else {
            await User.create({
                name: DUMMY_USER.name,
                email: DUMMY_USER.email,
                password: hashPassword,
            })
            console.log(`Created demo user: ${DUMMY_USER.email}`)
        }
    } catch (error) {
        console.error('Failed to seed demo user:', error)
        process.exitCode = 1
    } finally {
        await mongooseConnection.disconnect()
    }
}

void seedDummyUser()
