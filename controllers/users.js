const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByCrendentials } = require("../models/user");
const { SUCCESS_OK } = require("../utils/constants");
const NotFoundError = require("../errors/not-found-error");
const InvalidDataError = require("../errors/invalid-data-error");
const ConflictError = require("../errors/conflict-error");
const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;
const users = require("../models/user");

const getUsers = (req, res, next) => {
  users
    .find({})
    .toArray()
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError("Data is not found");
      }
      res.status(SUCCESS_OK).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  users
    .findOne({ _id: new ObjectID(req.params.userId) })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Data is not found");
      }
      res.status(SUCCESS_OK).send(user);
    })
    .catch(next);
};

const getCurrentUserData = (req, res, next) => {
  users
    .findById(req.user._id)
    .orFail(new NotFoundError("Data is not found"))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch(next);
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const user = await users.findOne({ email });

    if (user) {
      throw new ConflictError("This email is already exist");
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new users({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    await newUser.save();

    res.status(SUCCESS_OK).send({
      _id: newUser._id,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new InvalidDataError("Invalid data"));
    } else {
      next(err);
    }
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return findUserByCrendentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  users
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    )
    .orFail(new NotFoundError("Data is not found"))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new InvalidDataError("Invalid data"));
      }
      if (err.name === "CastError") {
        return next(new InvalidDataError("Invalid data"));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  users
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    )
    .orFail(new NotFoundError("Data is not found"))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new InvalidDataError("Invalid data"));
      }
      if (err.name === "CastError") {
        return next(new InvalidDataError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUserData,
  createUser,
  login,
  updateUser,
  updateUserAvatar,
};
