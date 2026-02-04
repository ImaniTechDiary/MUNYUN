import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false, index: true },
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    amount: { type: Number, required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date },
    note: { type: String }
  },
  { timestamps: true }
);

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
