const express = require("express");

const router = express.Router();

const {
  authValidation,
  cardValidationId,
  newCardValidation,
} = require("../middlewares/validations");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", authValidation, getCards);

router.post("/", authValidation, newCardValidation, createCard);

router.delete("/:cardId", authValidation, cardValidationId, deleteCard);

router.put("/likes/:cardId", authValidation, cardValidationId, likeCard);

router.delete("/likes/:cardId", authValidation, cardValidationId, dislikeCard);

module.exports = router;
