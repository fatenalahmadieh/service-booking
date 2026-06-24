const express = require('express');
const app = express();
const { connectDB } = require('./database');
const userRouter = require('./routers/userRouter');
const flightRouter = require('./routers/flightRouter');
const bookingRouter = require('./routers/bookingRouter');
const authRouter = require('./routers/authRouter');
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', flightRouter);
app.use('/api', bookingRouter);
app.get('/test', (req, res) => res.send('Server is alive!'));
connectDB();

app.listen(3000, () => {
    console.log('server is running on port 3000');
});