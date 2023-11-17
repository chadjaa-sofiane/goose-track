interface Config {
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
    database: {
        url: process.env.MONGODB_URI || '',
        db_name: 'production',
    },
}

const developmentConfigs = {
    ...commonConfigs,
    hostname: 'localhost',
    database: {
        ...commonConfigs.database,
        db_name: 'production',
    },
}

const productionConfigs = {
    ...commonConfigs,
    hostname: process.env.HOSTNAME || '',
    database: {
        ...commonConfigs.database,
        db_name: 'production',
    },
}

const testConfigs = {
    ...commonConfigs,
    hostname: process.env.HOSTNAME || '',
    database: {
        ...commonConfigs.database,
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
