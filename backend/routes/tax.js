const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Simplified Indian tax slabs for DEMO purposes only -- not accurate for real filing.
function calcOldRegime(income, deductions80C, deductions80D, hra) {
  // Total deductions allowed under old regime
  const totalDeductions = deductions80C + deductions80D + hra;
  const taxable = Math.max(0, income - totalDeductions - 50000); // standard deduction
  
  let tax = 0;
  if (taxable > 1000000) tax += (taxable - 1000000) * 0.3;
  if (taxable > 500000) tax += (Math.min(taxable, 1000000) - 500000) * 0.2;
  if (taxable > 250000) tax += (Math.min(taxable, 500000) - 250000) * 0.05;
  return Math.round(tax * 1.04); // + 4% cess
}

function calcNewRegime(income) {
  // New regime - no deductions except standard deduction
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

// Calculate tax with all deductions
router.post('/calculate', auth, (req, res) => {
  try {
    const { grossIncome, deduction80C, deduction80D, hra } = req.body;
    
    const income = Number(grossIncome) || 0;
    const dec80C = Number(deduction80C) || 0;
    const dec80D = Number(deduction80D) || 0;
    const hraAmount = Number(hra) || 0;

    if (income <= 0) {
      return res.status(400).json({ message: 'Gross income must be greater than 0' });
    }

    const oldRegimeTax = calcOldRegime(income, dec80C, dec80D, hraAmount);
    const newRegimeTax = calcNewRegime(income);

    // Tax saved is the difference between old and new regime
    const taxSaved = Math.max(0, oldRegimeTax - newRegimeTax);

    res.json({
      grossIncome: income,
      deduction80C: dec80C,
      deduction80D: dec80D,
      hra: hraAmount,
      oldRegimeTax,
      newRegimeTax,
      taxSaved,
      recommended: oldRegimeTax <= newRegimeTax ? 'old' : 'new',
      analysis: {
        oldRegimeMessage: `Under Old Regime: ₹${oldRegimeTax.toLocaleString('en-IN')}`,
        newRegimeMessage: `Under New Regime: ₹${newRegimeTax.toLocaleString('en-IN')}`
      }
    });
  } catch (err) {
    console.error('Tax calculation error:', err);
    res.status(500).json({ message: 'Error calculating tax', error: err.message });
  }
});

module.exports = router;
