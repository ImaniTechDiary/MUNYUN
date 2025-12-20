import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
)

const Event = mongoose.model('Event', eventSchema)

export default Event