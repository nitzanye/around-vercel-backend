const { Schema, model } = require("mongoose");
const { validateUrl } = require("../middlewares/validations");

const cardSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: validateUrl,
      message: "Invalid URL",
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const cards = model("card", cardSchema);
module.exports = cards;

// const cards = client.db.createCollection("card", {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["name", "link"],
//       properties: {
//         name: {
//           bsonType: "string",
//           minLength: 2,
//           maxLength: 30,
//         },
//         link: {
//           bsonType: "string",
//           pattern:
//             "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$",
//         },
//         owner: {
//           bsonType: "objectId",
//         },
//         likes: {
//           bsonType: "array",
//           items: { bsonType: "objectId" },
//         },
//         createdAt: {
//           bsonType: "date",
//         },
//       },
//     },
//   },
// });

// module.exports = { cards };

// const insertCard = (card) => {
//   return cards.insertOne(card);
// };

// const updateCard = (query, newData) => {
//   return cards.updateOne(query, { $set: newData });
// };

// const findCard = (query) => {
//   return cards.findOne(query);
// };

// const findCards = (query) => {
//   return cards.find(query).toArray();
// };

// module.exports = { insertCard, updateCard, findCard, findCards };

// //! prev code
// const mongoose = require('mongoose');
// const { validateUrl } = require("../middlewares/validations");
// const cardSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minlength: 2,
//     maxlength: 30,
//     required: true,
//   },
//   link: {
//     type: String,
//     required: true,
//     validate: {
//       validator: validateUrl,
//       message: 'Invalid URL',
//     },
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'user',
//     required: true,
//   },
//   likes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'user',
//       default: [],
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
// });

// module.exports = mongoose.model('card', cardSchema);
