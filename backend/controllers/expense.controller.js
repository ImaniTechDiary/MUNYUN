import Expense from '../models/expense.model.js';
import mongoose from 'mongoose';


// UTILS
import { categorizeExpense, learnFromCorrection } from '../utils/categorizeExpense.js'

const DEMO_USER_ID = 'demo';

export const getExpenses = async (req, res) => { 
    try {
        const userId = req.user?.uid;
        const query = userId
            ? { userId }
            : { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: DEMO_USER_ID }] };
        const expenses = await Expense.find(query)
        res.status(200).json({ success: true, data: expenses})
    } catch (error) {
        console.log("error in fetching expenses:", error.message);
        res.status(500).json({ success: false, message: "Server error: " })
    }
};


export const createExpense = async (req, res) => {
    const { name, price } = req.body;
    if(!name || !price) {
        return res.status(400).json({ success: false, message: "Please provide all fields"})
    }

    const userId = req.user?.uid || DEMO_USER_ID;
    const { category, confidence, source} = await categorizeExpense(
        name,
        userId
    );

    const newExpense = new Expense({
        ...req.body,
        category,
        aiMeta: {confidence, source},
        userId
    });

    try {
        await newExpense.save(); //saves expense to the db
        res.status(201).json({ success: true, data: newExpense})
    } catch (error) {
        console.error("Error in Create Expense", error.message);
        res.status(500).json({ success: false, message: " Server Error"})
    }
};

export const updateExpense = async (req, res) => {
    const { id } = req.params; // get id 

    const expense = req.body; // fields such as name, price, image, etc

    if ( !mongoose.Types.ObjectId.isValid(id)) { 
        return res.status(404).json({ success: false, message: "invalid expense id"});
    }

    try {
       const userId = req.user?.uid;
       const query = userId
            ? { _id: id, userId }
            : { _id: id, $or: [{ userId: { $exists: false } }, { userId: null }, { userId: DEMO_USER_ID }] };
       const updatedExpense = await Expense.findOneAndUpdate(query, expense, {new: true});
       res.status(200).json({ success: true, data: updatedExpense })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
};

export const deleteExpense = async (req, res) => {
    const {id} = req.params 

    if ( !mongoose.Types.ObjectId.isValid(id)) { 
        return res.status(404).json({ success: false, message: "invalid expense id"});
    }
    
    try {
        const userId = req.user?.uid;
        const query = userId
            ? { _id: id, userId }
            : { _id: id, $or: [{ userId: { $exists: false } }, { userId: null }, { userId: DEMO_USER_ID }] };
        await Expense.findOneAndDelete(query)
        res.status(200).json({ success: true, message: 'Expense deleted successfully'})
    } catch (error) {
        console.log("error in deleting expense:", error.message);
        res.status(500).json({ success: false, message: 'Server Error' })
    }
};

// export const updateCategory = async (req, res) => {
//     try {
//         const {category} = req.body
//         const updateTheExpense = await Expense.findByIdAndUpdate(
//             req.params.id,
//             {category},
//             {new: true}
//         )
//         res.status(200).json(updateTheExpense)
//     } catch (error) {
//         res.status(500).json({error: 'Failed to update category'})
//     }
// }

export const updateCategory = async (req, res) => {
  try {
    const { category: updatedCategory } = req.body;

    // 1️- Get the existing expense FIRST
    const userId = req.user?.uid;
    const query = userId
        ? { _id: req.params.id, userId }
        : { _id: req.params.id, $or: [{ userId: { $exists: false } }, { userId: null }, { userId: DEMO_USER_ID }] };
    const expense = await Expense.findOne(query);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // 2️- Only learn if category actually changed
    if (updatedCategory && updatedCategory !== expense.category) {
      await learnFromCorrection(
        expense,
        updatedCategory,
        userId || DEMO_USER_ID
      );
    }

    // 3️- Update the expense
    expense.category = updatedCategory;
    await expense.save();

    res.status(200).json({ success: true, data: expense });

  } catch (error) {
    console.error('Category update error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};



export const getExpenseReport = async (req, res) => {
   try {
    const userId = req.user?.uid;
    const matchStage = userId
        ? { userId }
        : { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: DEMO_USER_ID }] };
    const reportData = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$price" }
        }
      }
    ]);

    const formattedData = reportData.map(item => ({
      category: item._id,
      value: item.total,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};
