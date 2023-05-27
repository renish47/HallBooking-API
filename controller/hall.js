const Hall = require('../model/hall')
const Booking = require('../model/booking')
const Customer = require('../model/customer')

exports.createHall = async (req, res, next) => {
    let name = req.body.name;
    let capacity = req.body.capacity;
    let pricePerHour = req.body.pricePerHour;
    let amenities = req.body.amenities;

    try {

        let hall = await Hall.findOne({ name: name });
        if (hall) {
            const error = new Error("Hall with this name already exist")
            error.status = 403
            throw error
        }
        else {
            const newHall = new Hall({
                name,
                capacity,
                pricePerHour,
                amenities
            })
            const data = await newHall.save();
            res.status(201).json({
                message: "Hall Created Successfully",
                data
            })
        }

    } catch (error) {
        next(error);
    }
}

exports.bookHall = async (req, res, next) => {
    let customerName = req.body.customerName;
    let customerMailId = req.body.customerMailId;
    let hallName = req.body.hallName;
    let date = req.body.date;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let customer

    try {
        if (startTime === endTime) {
            const error = new Error("startTime and endTime cant have same value")
            error.status = 403
            throw error
        }
        const hallData = await Hall.findOne({ name: hallName });
        if (hallData) {
            const pastBookings = await Booking.find({ date: date });
            if (pastBookings) {
                pastBookings.forEach(pastBooking => {

                    if ((startTime < pastBooking.endTime && startTime > pastBooking.startTime) ||
                        (endTime < pastBooking.endTime && endTime > pastBooking.startTime) ||
                        startTime === pastBooking.startTime) {
                        const error = new Error(`Hall already booked from ${pastBooking.startTime} till ${pastBooking.endTime} on ${date}`)
                        error.status = 403
                        throw error
                    }
                })
            }
            customer = await Customer.findOne({ email: customerMailId })
            if (!customer) {
                customer = new Customer({
                    name: customerName,
                    email: customerMailId
                })
                customer = await customer.save()
            }

            const booking = new Booking({
                hall: hallData._id,
                customer: customer._id,
                date,
                startTime,
                endTime
            })

            const bookingData = await booking.save()
            customer.bookings = [...customer.bookings, bookingData._id]
            hallData.bookings = [...hallData.bookings, bookingData._id]
            hallData.bookedStatus = true
            await Hall.findByIdAndUpdate({ _id: hallData._id }, { ...hallData })
            await Customer.findByIdAndUpdate({ _id: customer._id }, { ...customer })

            res.status(201).json({
                message: "Hall Booked Successfully",
                bookingData
            })
        }
        else {
            const error = new Error("There is no hall named " + hallName)
            error.status = 403
            throw error
        }

    } catch (error) {
        console.log(error)
        next(error)
    }

}

exports.getHallList = async (req, res, next) => {
    try {
        const halls = await Hall.find({}, { amenities: 0, __v: 0, capacity: 0, pricePerHour: 0 }).populate({ path: "bookings", populate: { path: "customer", select: "name" }, select: "customer date startTime endTime" })
        if (!halls) {
            const error = new Error('No Halls Created Yet')
            error.status = 403
            throw error
        }
        res.status(200).json({ halls })
    } catch (error) {
        next(error)
    }
}

exports.getCustomerList = async (req, res, next) => {
    try {
        const customers = await Customer.find({}, { email: 0, __v: 0 }).populate({ path: "bookings", populate: { path: "hall", select: "name" }, select: "hall date startTime endTime" })
        if (!customers) {
            const error = new Error('No Customers in database')
            error.status = 403
            throw error
        }
        res.status(200).json({ customers })
    } catch (error) {
        next(error)
    }
}

exports.getHallBookingDetails = async (req, res, next) => {
    const hallName = req.body.hallName
    try {
        const hall = await Hall.findOne({ name: hallName }, { amenities: 0, __v: 0, capacity: 0, pricePerHour: 0 }).populate({ path: "bookings", populate: { path: "customer", select: "name" }, select: "customer date startTime endTime" })
        if (!hall) {
            const error = new Error("There is no hall named " + hallName)
            error.status = 403
            throw error
        }
        res.status(200).json({
            name: hall.name,
            _id: hall._id,
            bookings: hall.bookings

        })
    } catch (error) {
        next(error)
    }
}