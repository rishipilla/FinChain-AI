const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: String,
  description: String,
  amount: Number,
  type: { type: String, enum: ['credit', 'debit'] },
  category: String
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  annualIncome: { type: Number, default: 0 },
  investments80C: { type: Number, default: 0 },
  transactions: [transactionSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);