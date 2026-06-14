import { Router } from 'express';
import { body } from 'express-validator';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from '../controllers/expense.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const expenseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be 2-100 characters'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Food', 'Travel', 'Shopping', 'Bills', 'Other'])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

// @route   GET /api/expenses/stats
// Note: This must be before /:id to avoid matching "stats" as an id
router.get('/stats', getExpenseStats);

// @route   GET /api/expenses
router.get('/', getExpenses);

// @route   POST /api/expenses
router.post('/', expenseValidation, validate, createExpense);

// @route   PUT /api/expenses/:id
router.put('/:id', expenseValidation, validate, updateExpense);

// @route   DELETE /api/expenses/:id
router.delete('/:id', deleteExpense);

export default router;
