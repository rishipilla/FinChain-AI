function calcOldRegime(income, deductions80C = 0, deductions80D = 0, hra = 0) {
  const taxable = Math.max(0, income - deductions80C - deductions80D - hra - 50000);
  let tax = 0;
  if (taxable > 1000000) tax += (taxable - 1000000) * 0.3;
  if (taxable > 500000) tax += (Math.min(taxable, 1000000) - 500000) * 0.2;
  if (taxable > 250000) tax += (Math.min(taxable, 500000) - 250000) * 0.05;
  return Math.round(tax * 1.04);
}

function calcNewRegime(income) {
  const taxable = Math.max(0, income - 75000);
  const slabs = [
    [300000, 0],
    [700000, 0.05],
    [1000000, 0.1],
    [1200000, 0.15],
    [1500000, 0.2],
    [Infinity, 0.3],
  ];

  let tax = 0;
  let previous = 0;
  for (const [limit, rate] of slabs) {
    if (taxable > previous) {
      tax += (Math.min(taxable, limit) - previous) * rate;
      previous = limit;
    }
  }
  return Math.round(tax * 1.04);
}

module.exports = { calcOldRegime, calcNewRegime };
