const express = require('express');
const { body } = require('express-validator');
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
} = require('../controllers/roleController');

const router = express.Router();

// Validation middleware
const roleValidation = [
  body('name')
    .notEmpty()
    .withMessage('Role name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Role name must be between 1 and 50 characters')
    .trim(),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Description must not exceed 255 characters')
    .trim()
];

// Routes
router.post('/', roleValidation, createRole);
router.get('/', getAllRoles);
router.get('/:id', getRoleById);
router.put('/:id', roleValidation, updateRole);
router.delete('/:id', deleteRole);

module.exports = router;