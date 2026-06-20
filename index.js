const express = require('express');
const app = express();
const { connectDB } = require('./database');
const userRouter = require('./routers/userRouter');
const flightRouter = require('./routers/flightRouter');
const bookingRouter = require('./routers/bookingRouter');
app.use(express.json());

app.use('/api', userRouter);
app.use('/api', flightRouter);
app.use('/api', bookingRouter);

connectDB();

app.listen(3000, () => {
    console.log('server is running on port 3000');
});