import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expense from '../models/expense.model.js';
import Event from '../models/event.model.js';
import Budget from '../models/budget.model.js';

dotenv.config();

const DEMO_USER_ID = 'demo';

const demoExpenses = [
  { name: 'Groceries', price: 85, category: 'Groceries' },
  { name: 'Gas', price: 42, category: 'Transportation' },
  { name: 'Coffee', price: 6, category: 'Food' },
  { name: 'Movie night', price: 18, category: 'Entertainment' },
  { name: 'Rent', price: 1200, category: 'Rent' },
];

const demoEvents = [
  { title: 'Pay Rent', start: new Date(), end: new Date() },
  { title: 'Budget Check-In', start: new Date(Date.now() + 86400000), end: new Date(Date.now() + 90000000) },
];

const demoBudgets = [
  { type: 'monthly', amount: 2500, periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
  { type: 'weekly', amount: 600, periodStart: new Date() },
  { type: 'daily', amount: 85, periodStart: new Date() },
];

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI');
  }
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Expense.find({ userId: DEMO_USER_ID }).limit(1);
  if (existing.length === 0) {
    await Expense.insertMany(demoExpenses.map((e) => ({
      ...e,
      userId: DEMO_USER_ID,
      aiMeta: { confidence: 85, source: 'demo' }
    })));
  }

  const existingEvents = await Event.find({ userId: DEMO_USER_ID }).limit(1);
  if (existingEvents.length === 0) {
    await Event.insertMany(demoEvents.map((e) => ({ ...e, userId: DEMO_USER_ID })));
  }

  const existingBudgets = await Budget.find({ userId: DEMO_USER_ID }).limit(1);
  if (existingBudgets.length === 0) {
    await Budget.insertMany(demoBudgets.map((b) => ({ ...b, userId: DEMO_USER_ID })));
  }

  await mongoose.disconnect();
  console.log('Demo seed complete');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
