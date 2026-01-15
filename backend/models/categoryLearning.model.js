import mongoose from 'mongoose';

const categoryLearningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  keyword: {
    type: String,
    required: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

categoryLearningSchema.index({ userId: 1, keyword: 1 }, { unique: true });

export default mongoose.model('CategoryLearning', categoryLearningSchema);
