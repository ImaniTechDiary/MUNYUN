import { create } from 'zustand'
import { updateExpense } from '../../../backend/controllers/expense.controller';

export const useExpenseTracking = create((set) => ({
    expenses: [],
    setExpenses: (expenses) => set({expenses}),
    // passing new expense into function to create expense for db
    createExpense: async (newExpense) => {
        if (!newExpense.name || !newExpense.price) {
            return {success: false, message: 'Please fill in all the required information'}
        }

        const expenseData = {
            name: newExpense.name,
            price: newExpense.price,
            category: newExpense.category,
        }

        // only include an image if it exists
        if(newExpense.image) {
            expenseData.image = newExpense.image;
        }

        const res = await fetch('http://localhost:8000/api/expenses/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        })

        const data = await res.json()
        set((state) => ({ expenses: [...state.expenses, data.data] }))
        return { success: true, message: 'Expense created successfully'}
    },

    // send request to endpoint and grab the expenses
    fetchExpenses: async () => {
        const res = await fetch('http://localhost:8000/api/expenses/') //fetch the endpoint
        const data = await res.json() //extract the data
        set({ expenses: data.data}) //returning the data
    },

    // delete an expense
    deleteExpense: async (eid) => {
        const res = await fetch(`http://localhost:8000/api/expenses/${eid}`, { //pass the expense id (eid) through the server request to use the delete method to delete the expense
            method: 'DELETE',

        })
        const data = await res.json() // get the data and extract
        if(!data.success) return { success: false, message: data.message} //if data success is false, then update the state

        set(state => ({ 
            expenses: state.expenses.filter(expense => expense._id !== eid)
        })) //use filter method to delete current expense from the state and update the ui at the same time
        return {success: true, message: data.message}
    },

    updateExpense: async (eid, updatedExpense) => {
        const res = await fetch(`http://localhost:8000/api/expenses/${eid}` , {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedExpense),
        })
        const data = await res.json() // get data & extract
        if(!data.success) return { success: false, message: data.message} //if data success is false, then update state

        set((state) => ({
            expenses: state.expenses.map((expense => expense._id === eid ? data.data : expense)), //update the ui immediately without needed to refresh
        }))    
        
    },
    

    updateExpenseCategory: async (eid, category) => {
        const res = await fetch(
            `http://localhost:8000/api/expenses/update-category/${eid}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ category }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: 'Failed to update category' };
        }

        set((state) => ({
            expenses: state.expenses.map((expense) =>
                // helps to auto-update when using aiMeta in mondel, w/o having to touch the frontend logic again
                expense._id === eid ? data.data : expense 
                // expense._id === eid
                //     ? { ...expense, category }
                //     : expense
            ),
        }));

        return { success: true, data };
    },
}));




    



