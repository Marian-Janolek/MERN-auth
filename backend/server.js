const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const connectDB = require('./db/db');
const morgan = require('morgan');

connectDB();

const goalsRouter = require('./routes/goalRoutes');
const userRouter = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/goals', goalsRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
