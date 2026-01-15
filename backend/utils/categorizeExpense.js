import CategoryLearning from '../models/CategoryLearning.js';

const BASE_RULES = {
  food: ['restaurant', 'cafe', 'coffee', 'starbucks', 'chipotle'],
  transport: ['uber', 'lyft', 'gas', 'shell', 'chevron'],
  entertainment: ['netflix', 'spotify', 'movie'],
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
