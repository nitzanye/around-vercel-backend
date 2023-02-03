const { Schema, model } = require("mongoose");
const { validateUrl, validateEmail } = require("../middlewares/validations");

const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../errors/unauthorized-error");

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Dark Mode",
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
    default:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
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
