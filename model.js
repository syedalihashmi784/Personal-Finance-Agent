import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
        
    }, 
    amount: {
        type: Number,
        required: true
    }
},{timestamps: true});

const Expense = mongoose.model('Expense', ExpenseSchema, 'expenses');
export default Expense;



