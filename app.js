const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotEnv = require('dotenv')

const hall = require('./controller/hall')


const app = express();
dotEnv.config()

app.use(bodyParser.json());

app.post('/create-hall', hall.createHall)
app.post('/book-hall', hall.bookHall)
app.get('/get-hallsList', hall.getHallList)
app.get('/get-customerList', hall.getCustomerList)
app.post('/get-hallBookingDetails', hall.getHallBookingDetails)

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect(process.env.MONGOOSE_URL)
    .then(res => {
        app.listen(process.env.PORT, () => console.log("App is Listening"))
    })
    .catch(err => console.log(err));

