const express = require("express");

const router = express.Router();

const {
  authValidation,
  validateUserdId,
  updateUserValidation,
  updateAvatarValidation,
} = require("../middlewares/validations");

const {
  getUsers,
  getCurrentUserData,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/", authValidation, getUsers);
router.get("/me", authValidation, getCurrentUserData);
router.get("/:userId", authValidation, validateUserdId, getUserById);

router.patch("/me", authValidation, updateUserValidation, updateUser);
router.patch(
  "/me/avatar",
  authValidation,
  updateAvatarValidation,
  updateUserAvatar
);

module.exports = router;

// // router.post('/users', createUser);
