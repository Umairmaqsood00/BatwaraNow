const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    paidBy: {
        type: String,
        required: [true, 'Please specify who paid']
    },
    splitBetween: [{
        name: String,
        amount: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);
