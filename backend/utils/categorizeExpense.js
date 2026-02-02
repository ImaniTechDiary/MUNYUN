// import CategoryLearning from '../models/categoryLearning.model.js';

const BASE_RULES = {
  food: ['restaurant', 'cafe', 'coffee', 'starbucks', 'chipotle', 'groceries'],
  transport: ['uber', 'lyft', 'gas', 'shell', 'chevron'],
  subcriptions: ['netflix', 'spotify'],
  entertainment: ['movies', 'painting'],
  shopping: ['amazon', 'target', 'walmart'],
};

export const categorizeExpense = async (name, userId) => {
  const normalized = name.toLowerCase();

  // 1️- Check learned keywords FIRST
  const learned = await CategoryLearning.find({ userId });

  for (const entry of learned) {
    if (normalized.includes(entry.keyword)) {
      return {
        category: entry.category,
        source: 'learned',
        confidence: Math.min(100, entry.confidence * 20),
      };
    }
  }

  // 2 - Fallback to base rules
  let bestMatch = { category: 'uncategorized', score: 0 };

  for (const [category, keywords] of Object.entries(BASE_RULES)) {
    const matches = keywords.filter(k => normalized.includes(k)).length;

    if (matches > bestMatch.score) {
      bestMatch = { category, score: matches };
    }
  }

  return {
    category: bestMatch.score > 0 ? bestMatch.category : 'uncategorized',
    source: 'rules',
    confidence: bestMatch.score * 25,
  };
};


export const learnFromCorrection = async (expense, newCategory, userId) => {
    try {
        const categoryKeywords = expense.name.toLowerCase().split(' ')

        for (const word of categoryKeywords) {
            if (word.length < 4) continue;

            await categoryLearningModel.findOneAndUpdate(
                { userId, categoryKeyword: word}, 
                {
                    category: newCategory,
                    $inc: {confidence: 1}
                },
                { upsert: true, new: true}
            )
        }
    } catch (error) {

    }
}