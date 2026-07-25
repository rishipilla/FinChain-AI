const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Simplified Indian tax slabs for DEMO purposes only -- not accurate for real filing.
function calcOldRegime(income, deductions) {
  const taxable = Math.max(0, income - deductions - 50000); // standard deduction
  let tax = 0;
  if (taxable > 1000000) tax += (taxable - 1000000) * 0.3;
  if (taxable > 500000) tax += (Math.min(taxable, 1000000) - 500000) * 0.2;
  if (taxable > 250000) tax += (Math.min(taxable, 500000) - 250000) * 0.05;
  return Math.round(tax * 1.04); // + 4% cess
}

function calcNewRegime(income) {
  const taxable = Math.max(0, income - 75000); // standard deduction (new regime)
  const slabs = [
    [300000, 0], [700000, 0.05], [1000000, 0.1],
    [1200000, 0.15], [1500000, 0.2], [Infinity, 0.3]
  ];
  let tax = 0, prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxable > prev) {
      tax += (Math.min(taxable, limit) - prev) * rate;
      prev = limit;
    }
  }
  return Math.round(tax * 1.04);
}

router.post('/calculate', auth, (req, res) => {
  const { annualIncome, deductions80C } = req.body;
  const income = Number(annualIncome) || 0;
  const deductions = Number(deductions80C) || 0;

  const oldRegimeTax = calcOldRegime(income, deductions);
  const newRegimeTax = calcNewRegime(income);

  res.json({
    oldRegimeTax,
    newRegimeTax,
    recommended: oldRegimeTax <= newRegimeTax ? 'old' : 'new',
    savings: Math.abs(oldRegimeTax - newRegimeTax)
  });
});

module.exports = router;