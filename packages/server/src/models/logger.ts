import { Schema, Types, model } from 'mongoose'

const loggerSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    details: {
        ip: String,
        userAgent: String,
    },
})

export default model('Logger', loggerSchema)
