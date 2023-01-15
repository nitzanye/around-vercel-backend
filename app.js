const express = require('express');

const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
});

const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// app.use(express.json());
app.use(bodyParser.json());

require('dotenv').config();

const { PORT = 3000 } = process.env;

const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { pageNotFound } = require('./controllers/page-not-found');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  // authValidation,
  validateUser,
  validateLogin,
} = require('./middlewares/validations');

const serverErrorHandler = require('./middlewares/server-error-handler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // in 15 minutes
  max: 100, // you can make a maximum of 100 requests from one IP
});

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

app.use(requestLogger);

// applying the rate-limiter
app.use(limiter);

app.use(helmet());

// enable requests for all routes
// must come before the route handlers

app.use(cors());
app.options('*', cors());

// server crash testing
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// register and login
app.post('/signup', validateUser, createUser);
app.post('/signin', validateLogin, login);

// authorization
app.use(auth);

app.use('/', userRouter);
app.use('/', cardsRouter);

// must come after the route handlers and before the error handlers
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// centralized error handler
app.use(serverErrorHandler);

app.use('*', pageNotFound);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
