const express = require("express");

const app = express();
require("dotenv").config();
require("./db");

// const uri = "mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/test?w=majority";

// close client
// client.close();

const helmet = require("helmet");
const bodyParser = require("body-parser");
//const cors = require("cors");
//const rateLimit = require("express-rate-limit");

// app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

app.use(bodyParser.json());

const { PORT = 3000 } = process.env;

const { errors } = require("celebrate");
const { createUser, login } = require("./controllers/users");
const { pageNotFound } = require("./controllers/page-not-found");
const auth = require("./middlewares/auth");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  // authValidation,
  validateUser,
  validateLogin,
} = require("./middlewares/validations");

const serverErrorHandler = require("./middlewares/server-error-handler");

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // in 15 minutes
//   max: 100, // you can make a maximum of 100 requests from one IP
// });

const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

app.use(requestLogger);

// applying the rate-limiter
// app.use(limiter);

app.use(helmet());

// enable requests for all routes
// must come before the route handlers

// app.use(cors());
// app.options("*", cors());

// register and login
app.post("/signup", validateUser, createUser);
app.post("/signin", validateLogin, login);

// authorization
app.use(auth);

app.use("/users", userRouter);
app.use("/cards", cardsRouter);

// // must come after the route handlers and before the error handlers
app.use(errorLogger);

// // celebrate error handler
app.use(errors());

// // centralized error handler
app.use(serverErrorHandler);

//app.use("*", pageNotFound);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// mongoose.connect(
//   `mongodb+srv://admin:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.spz2prz.mongodb.net/aroundb`,
//   {
//     useNewUrlParser: true,
//   }
// );

// const url = 'mongodb://localhost:27017/aroundb';

//! prev vertion

// const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost:27017/aroundb', {
//   useNewUrlParser: true,
// });
