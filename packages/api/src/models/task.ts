import { Schema, model } from 'mongoose'

const taskSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        start: {
            type: String,
            required: true,
        },
        end: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        container: {
            type: String,
            default: 'to do list',
        },
    },
    {
        timestamps: true,
    }
)

export default model('Task', taskSchema)
