import { Response, NextFunction } from 'express';
import Expense from '../models/Expense';
import { AuthRequest } from '../types';

// @desc    Get all expenses for user
// @route   GET /api/expenses
export const getExpenses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { category, startDate, endDate, sort = '-date' } = req.query;

    // Build filter
    const filter: any = { user: userId };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const expenses = await Expense.find(filter)
      .sort(sort as string)
      .lean();

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
export const createExpense = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, amount, category, date, description } = req.body;

    const expense = await Expense.create({
      user: req.user?.id,
      title,
      amount,
      category,
      date: date || new Date(),
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
export const updateExpense = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    let expense = await Expense.findById(id);

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
      return;
    }

    // Ensure user owns the expense
    if (expense.user.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense',
      });
      return;
    }

    expense = await Expense.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const expense = await Expense.findById(id);

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
      return;
    }

    // Ensure user owns the expense
    if (expense.user.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense',
      });
      return;
    }

    await Expense.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
export const getExpenseStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Total expenses
    const totalResult = await Expense.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId!) } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalExpenses = totalResult[0]?.total || 0;

    // Current month expenses
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const monthlyResult = await Expense.aggregate([
      {
        $match: {
          user: require('mongoose').Types.ObjectId.createFromHexString(userId!),
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const monthlyExpenses = monthlyResult[0]?.total || 0;

    // Category breakdown
    const categoryBreakdown = await Expense.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId!) } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrend = await Expense.aggregate([
      {
        $match: {
          user: require('mongoose').Types.ObjectId.createFromHexString(userId!),
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          total: 1,
        },
      },
    ]);

    // Total expense count
    const expenseCount = await Expense.countDocuments({
      user: require('mongoose').Types.ObjectId.createFromHexString(userId!),
    });

    res.status(200).json({
      success: true,
      data: {
        totalExpenses,
        monthlyExpenses,
        expenseCount,
        categoryBreakdown,
        monthlyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};
