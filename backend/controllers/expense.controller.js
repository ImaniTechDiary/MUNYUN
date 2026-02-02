import Expense from '../models/expense.model.js';
import mongoose from 'mongoose';


// UTILS
import { categorizeExpense } from '../utils/categorizeExpense.js'

export const getExpenses = async (req, res) => { 
    try {
        const expenses = await Expense.find({}) //fetching an empty object will find all the expenses in the database
        res.status(200).json({ success: true, data: expenses})
    } catch (error) {
        console.log("error in fetching expenses:", error.message);
        res.status(500).json({ success: false, message: "Server error: " })
    }
};


export const createExpense = async (req, res) => {
    const { category, confidence, source} = await categorizeExpense(
        req.body.name,
        req.user._id
    );

    const expense = await Expense.create({
        ...req.body,
        category,
        aiMeta: {confidence, source}
    })
    // const expense = req.body; // user will send this data 

    // if(!expense.name || !expense.price || !expense.image) {
    //     return res.status(400).json({ success: false, message: "Please provide all fields"})
    // }

     if(!expense.name || !expense.price) {
        return res.status(400).json({ success: false, message: "Please provide all fields"})
    }

    const newExpense = new Expense(expense);

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
       const updatedExpense = await Expense.findByIdAndUpdate(id, expense, {new: true});
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
        await Expense.findByIdAndDelete(id)
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
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const userId = req.user?._id || 'default-user' // placeholder until auth is set up
    // 2️- Only learn if category actually changed
    if (updatedCategory && updatedCategory !== expense.category) {
      await learnFromCorrection(
        expense,
        updatedCategory,
        'default-user'
        // 'req.user._id '  // or a placeholder if auth isn't ready yet
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
    const reportData = await Expense.aggregate([
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


