const { Schema, model } = require("mongoose");
const { validateUrl, validateEmail } = require("../middlewares/validations");

const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../errors/unauthorized-error");

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Jacques Cousteau",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Explorer",
  },
  avatar: {
    type: String,
    validate: {
      validator: validateUrl,
      message: "Invalid URL",
    },
    default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: "Invalid Email",
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const users = model("user", userSchema);
module.exports = users;

module.exports.findUserByCrendentials = async (email, password) => {
  try {
    const user = await users.findOne({ email });
    if (!user) {
      throw new UnauthorizedError("Incorrent Email, or Password");
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError("Incorect Email, or Password");
    }
    return user;
  } catch (err) {
    console.log(`Error.... ${err}`);
    throw err;
  }
};

// userSchema.statics.findUserByCrendentials = function findUserByCrendentials(
//   email,
//   password
// ) {
//   return this.findOne({ email }, "+password").then((user) => {
//     if (!user) {
//       return Promise.reject(
//         new UnauthorizedError("Incorrent Email, or Password")
//       );
//     }
//     // user found
//     return bcrypt.compare(password, user.password).then((matched) => {
//       if (!matched) {
//         // the hashes didn't match, rejecting the promise
//         return Promise.reject(
//           new UnauthorizedError("Incorect Email, or Password")
//         );
//       }
//       return user;
//     });
//   });
// };

// const findUserByCrendentials = async (email, password) => {
//   try {
//     const user = await users.findOne({ email });
//     if (!user) {
//       throw new UnauthorizedError("Incorrent Email, or Password");
//     }
//     const matched = await bcrypt.compare(password, user.password);
//     if (!matched) {
//       throw new UnauthorizedError("Incorect Email, or Password");
//     }
//     return user;
//   } catch (err) {
//     console.log(`Error.... ${err}`);
//     throw err;
//   }
// };

// module.exports = { findUserByCrendentials };

//! prev code
// const mongoose = require('mongoose');
// const bcrypt = require("bcryptjs");
// const { validateUrl, validateEmail } = require("../middlewares/validations");
// const UnauthorizedError = require("../errors/unauthorized-error");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     default: "Jacques Cousteau",
//   },
//   about: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     default: "Explorer",
//   },
//   avatar: {
//     type: String,
//     validate: {
//       validator: validateUrl,
//       message: "Invalid URL",
//     },
//     default: "https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg",
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     validate: {
//       validator: validateEmail,
//       message: "Invalid Email",
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false,
//   },
// });

// userSchema.statics.findUserByCrendentials = function findUserByCrendentials(
//   email,
//   password
// ) {
//   return this.findOne({ email })
//     .select("+password")
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(
//           new UnauthorizedError("Incorrent Email, or Password")
//         );
//       }
//       // user found
//       return bcrypt.compare(password, user.password).then((matched) => {
//         if (!matched) {
//           // the hashes didn't match, rejecting the promise
//           return Promise.reject(
//             new UnauthorizedError("Incorect Email, or Password")
//           );
//         }
//         return user;
//       });
//     });
// };

// module.exports = mongoose.model("user", userSchema);
