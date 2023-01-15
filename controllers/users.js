const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SUCCESS_OK } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const InvalidDataError = require('../errors/invalid-data-error');
const ConflictError = require('../errors/conflict-error');
// const user = require("../models/user");
const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(new NotFoundError('Data is not found'))
    .then((users) => res.status(SUCCESS_OK).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Data is not found'))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InvalidDataError('Invalid data'));
      }
      return next(err);
    });
};

const getCurrentUserData = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Data is not found'))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('This email is already exist');
      } else {
        return bcrypt.hash(password, SALT_ROUNDS);
      }
    })
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          res.status(SUCCESS_OK).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new InvalidDataError('Invalid data'));
          }
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCrendentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  // const currentUser = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    // { _id: currentUser },
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Data is not found'))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('Invalid data'));
      } if (err.name === 'CastError') {
        return next(new InvalidDataError('Invalid data'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  // const currentUser = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    // { _id: currentUser },
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Data is not found'))
    .then((user) => res.status(SUCCESS_OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('Invalid data'));
      }
      if (err.name === 'CastError') {
        return next(new InvalidDataError('Invalid data'));
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
