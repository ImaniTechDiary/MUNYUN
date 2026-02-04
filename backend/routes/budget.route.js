import express from 'express';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../controllers/budget.controller.js';

const budgetRouter = express.Router();

budgetRouter.get('/', getBudgets);
budgetRouter.post('/', createBudget);
budgetRouter.put('/:id', updateBudget);
budgetRouter.delete('/:id', deleteBudget);

export default budgetRouter;
