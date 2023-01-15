const express = require('express');

const router = express.Router();

const {
  authValidation,
  validateUserdId,
  updateUserValidation,
  updateAvatarValidation,
} = require('../middlewares/validations');

const {
  getUsers,
  getCurrentUserData,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', authValidation, getUsers);
router.get('/users/me', authValidation, getCurrentUserData);
router.get('/users/:userId', authValidation, validateUserdId, getUserById);

router.patch('/users/me', authValidation, updateUserValidation, updateUser);
router.patch(
  '/users/me/avatar',
  authValidation,
  updateAvatarValidation,
  updateUserAvatar,
);

module.exports = router;

// router.post('/users', createUser);
