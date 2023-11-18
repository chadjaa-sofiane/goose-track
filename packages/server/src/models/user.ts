import { Schema, model } from 'mongoose'

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            unique: false,
        },
        birthday: {
            type: Date,
            required: false,
        },
        skype: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

export default model('User', userSchema)
