const express = require("express");

const app = express();
require("dotenv").config();
require("./db");

const helmet = require("helmet");
const bodyParser = require("body-parser");
//const cors = require("cors");

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
const { validateUser, validateLogin } = require("./middlewares/validations");

const serverErrorHandler = require("./middlewares/server-error-handler");

const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

app.use(requestLogger);

app.use(helmet());

// register and login
app.post("/signup", validateUser, createUser);
app.post("/signin", validateLogin, login);

// authorization
app.use(auth);

app.use("/users", userRouter);
app.use("/cards", cardsRouter);

app.use(errorLogger);
app.use(errors());
app.use(serverErrorHandler);

//app.use("*", pageNotFound);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
