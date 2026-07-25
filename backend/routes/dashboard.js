const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const transactions = user.transactions || [];

    const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
    const totalDebit = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + Math.abs(t.amount), 0);

    const byCategory = {};
    transactions.forEach(t => {
      if (t.type === 'debit') {
        byCategory[t.category] = (byCategory[t.category] || 0) + Math.abs(t.amount);
      }
    });

    res.json({
      totalCredit,
      totalDebit,
      balance: totalCredit - totalDebit,
      spendingByCategory: byCategory,
      transactionCount: transactions.length,
      recentTransactions: transactions.slice(-10).reverse()
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;