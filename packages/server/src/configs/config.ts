interface Config {
    env: string
    port: number | string
    hostname: string
    publicJwtKey: string
    privateJwtKey: string
    database: {
        url: string
        db_name: string
    }
}

const privateJwtKey = await Bun.file('private-key.pem').text()
const publicJwtKey = await Bun.file('public-key.pem').text()

const commonConfigs = {
    port: process.env.PORT || 3000,
    privateJwtKey,
    publicJwtKey,
}

const developmentConfigs = {
    ...commonConfigs,
    env: 'development',
    hostname: 'localhost',
    database: {
        url: process.env.MONGODB_DEVELOPEMENT_URI || '',
        db_name: 'development',
    },
}

const productionConfigs = {
    ...commonConfigs,
    env: 'production',
    hostname: process.env.HOSTNAME || '',
    database: {
        url: process.env.MONGODB_PRODUCTION_URI || '',
        db_name: 'production',
    },
}

const testConfigs = {
    ...commonConfigs,
    env: 'test',
    hostname: process.env.HOSTNAME || '',
    database: {
        url: process.env.MONGODB_TEST_URI || '',
        db_name: 'test',
    },
}

const APP_ENV = process.env.BUN_ENV as 'development' | 'production' | 'test'

const configs: Record<typeof APP_ENV, Config> = {
    development: developmentConfigs,
    production: productionConfigs,
    test: testConfigs,
}

export default configs[APP_ENV]
