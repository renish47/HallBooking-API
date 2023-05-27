const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        bookings: [
            {
                type: Schema.Types.ObjectId,
                ref: "Booking"
            }
        ]
    }
)

module.exports = mongoose.model('Customer', customerSchema);