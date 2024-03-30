import crypto from 'crypto'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

const publicKeyPath = join(__dirname, '../public-key.pem')
const privateKeyPath = join(__dirname, '../private-key.pem')

fs.writeFileSync(publicKeyPath, publicKey)
fs.writeFileSync(privateKeyPath, privateKey)

console.log(`Writing public key to ${publicKey}`)
console.log(`Writing private key to ${privateKey}`)
