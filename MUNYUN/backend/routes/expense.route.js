import express from 'express';

import { createExpense, deleteExpense, getExpenses, updateExpense, updateCategory, getExpenseReport } from '../controllers/expense.controller.js';

const expenseRouter = express.Router();

// GET ALL EXPENSES
expenseRouter.get('/', getExpenses);


//CREATE AN EXPENSE 
expenseRouter.post('/', createExpense );


// UPDATE AN EXPENSE
expenseRouter.put('/:id', updateExpense)


// DELETE AN EXPENSE
expenseRouter.delete('/:id', deleteExpense ) //:id means it will be dynamic and can be any value the user passes


// Update expense category
expenseRouter.put('/update-category/:id', updateCategory)


// Reporting route to retrieve aggregated data for charting purposes
expenseRouter.get('/report', getExpenseReport)


export default expenseRouter;