const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
});

expenseSchema.index({ user: 1, date: 1 }); // optimize filtering

module.exports = mongoose.model('Expense', expenseSchema);
