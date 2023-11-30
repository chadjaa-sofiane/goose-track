import crypto from 'crypto'
import fs from 'fs'

const keypairs = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    },
})

const publicKey = keypairs.publicKey
const privateKey = keypairs.privateKey

fs.writeFileSync('./public-key.pem', publicKey)
fs.writeFileSync('./private-key.pem', privateKey)
