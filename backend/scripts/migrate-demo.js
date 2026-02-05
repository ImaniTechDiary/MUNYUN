import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expense from '../models/expense.model.js';
import Event from '../models/event.model.js';
import Budget from '../models/budget.model.js';

dotenv.config();

const DEMO_USER_ID = 'demo';

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI');
  }
  await mongoose.connect(process.env.MONGO_URI);

  const expenseResult = await Expense.updateMany(
    { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: '' }] },
    { $set: { userId: DEMO_USER_ID } }
  );

  const eventResult = await Event.updateMany(
    { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: '' }] },
    { $set: { userId: DEMO_USER_ID } }
  );

  const budgetResult = await Budget.updateMany(
    { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: '' }] },
    { $set: { userId: DEMO_USER_ID } }
  );

  await mongoose.disconnect();
  console.log('Demo migration complete:', {
    expensesUpdated: expenseResult.modifiedCount,
    eventsUpdated: eventResult.modifiedCount,
    budgetsUpdated: budgetResult.modifiedCount,
  });
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
