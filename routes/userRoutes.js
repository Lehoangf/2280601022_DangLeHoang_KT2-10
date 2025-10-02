const express = require('express');
const { body } = require('express-validator');
const {
  createUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  verifyUser
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware for user creation
const userCreateValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .trim(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('fullName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Full name must not exceed 100 characters')
    .trim(),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isMongoId()
    .withMessage('Invalid role ID')
];

// Validation middleware for user update
const userUpdateValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('fullName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Full name must not exceed 100 characters')
    .trim(),
  body('avatarUrl')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  body('status')
    .optional()
    .isBoolean()
    .withMessage('Status must be a boolean value'),
  body('role')
    .optional()
    .isMongoId()
    .withMessage('Invalid role ID'),
  body('loginCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Login count must be a non-negative integer')
];

// Validation middleware for user verification
const userVerifyValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim()
];

// Routes
router.post('/', userCreateValidation, createUser);
router.get('/', getAllUsers);
router.get('/id/:id', getUserById);
router.get('/username/:username', getUserByUsername);
router.put('/:id', userUpdateValidation, updateUser);
router.delete('/:id', deleteUser);
router.post('/verify', userVerifyValidation, verifyUser);

module.exports = router;