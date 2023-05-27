const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = Schema(
    {
        hall: {
            type: Schema.Types.ObjectId,
            ref: 'Hall'
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer'
        },
        date: {
            type: String,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model("Booking", bookingSchema);