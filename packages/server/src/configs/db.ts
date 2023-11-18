import mongoose, { ConnectOptions } from 'mongoose'
import config from './config'
import chalk from 'chalk'

const options: ConnectOptions = {}

const createMongoose = () => {
    const uri = config.database.url
    return {
        connect: async () => {
            try {
                await mongoose.connect(uri, options)

                console.log(
                    chalk.greenBright(`
        connected to the database succesfuly! 
        database name: ${chalk.white(
        mongoose.connection.db.databaseName
                            )}
                    `)
                )
            } catch (error) {
                console.error(error)
            }
        },
        disconnect: async () => {
            try {
                await mongoose.disconnect()
                console.log(
                    chalk.blueBright(`
        disconnected from the database succesfuly! 
                `)
                )
            } catch (error) {
                console.error(error)
            }
        },
    }
}

export default createMongoose
