const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        },
        pricePerHour: {
            type: Number,
            required: true
        },
        amenities: {
            wifi: {
                type: Boolean,
                default: false
            },
            airConditioned: {
                type: Boolean,
                default: false
            },
            aoundSystem: {
                type: Boolean,
                default: false
            },
            projector: {
                type: Boolean,
                default: false
            }
        },
        bookedStatus: {
            type: Boolean,
            default: false
        },
        bookings: [
            {
                type: Schema.Types.ObjectId,
                ref: "Booking"
            }
        ]
    }
)

module.exports = mongoose.model("Hall", hallSchema);