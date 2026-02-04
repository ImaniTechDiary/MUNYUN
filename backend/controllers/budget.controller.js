import Budget from '../models/budget.model.js';
import mongoose from 'mongoose';

export const getBudgets = async (req, res) => {
  try {
    const userId = req.user?.uid;
    const query = userId
      ? { userId }
      : { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: 'demo' }] };
    const budgets = await Budget.find(query).sort({ periodStart: -1 });
    res.status(200).json({ success: true, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createBudget = async (req, res) => {
  const { type, amount, periodStart, periodEnd, note } = req.body;
  if (!type || !amount || !periodStart) {
    return res.status(400).json({ success: false, message: 'Please provide all fields' });
  }

  try {
    const userId = req.user?.uid || 'demo';
    const budget = new Budget({
      userId,
      type,
      amount,
      periodStart,
      periodEnd,
      note
    });
    await budget.save();
    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateBudget = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid budget id' });
  }
  try {
    const userId = req.user?.uid;
    const query = userId
      ? { _id: id, userId }
      : { _id: id, $or: [{ userId: { $exists: false } }, { userId: null }, { userId: 'demo' }] };
    const updated = await Budget.findOneAndUpdate(query, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteBudget = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: 'Invalid budget id' });
  }
  try {
    const userId = req.user?.uid;
    const query = userId
      ? { _id: id, userId }
      : { _id: id, $or: [{ userId: { $exists: false } }, { userId: null }, { userId: 'demo' }] };
    await Budget.findOneAndDelete(query);
    res.status(200).json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
