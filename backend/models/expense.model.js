import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }, 
    image: {
        type: String,
        // required: true
    },
    category: { 
        type: String,
        default: 'Uncategorized'
    },
    userId: {
        type: String,
        index: true
    },
    aiMeta: {
        confidence: Number,
        source: String,
    }
}, {
    // createdAt, updatedAt
    timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
