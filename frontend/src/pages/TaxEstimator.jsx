import { useState } from 'react';
import api from '../api';

export default function TaxEstimator() {
  const [income, setIncome] = useState(800000);
  const [deductions, setDeductions] = useState(50000);
  const [result, setResult] = useState(null);

  const calculate = async () => {
    const res = await api.post('/tax/calculate', { annualIncome: income, deductions80C: deductions });
    setResult(res.data);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tax Estimator &amp; Simulator</h1>

      <label className="block mb-2">Annual Income: Rs.{income.toLocaleString()}</label>
      <input type="range" min="200000" max="3000000" step="10000" value={income}
        onChange={(e) => setIncome(Number(e.target.value))} className="w-full mb-6" />

      <label className="block mb-2">80C Deductions: Rs.{deductions.toLocaleString()}</label>
      <input type="range" min="0" max="150000" step="5000" value={deductions}
        onChange={(e) => setDeductions(Number(e.target.value))} className="w-full mb-6" />

      <button onClick={calculate} className="bg-blue-600 text-white px-6 py-2 rounded">Calculate</button>

      {result && (
        <div className="mt-6 bg-white shadow rounded-xl p-4">
          <p>Old Regime Tax: Rs.{result.oldRegimeTax}</p>
          <p>New Regime Tax: Rs.{result.newRegimeTax}</p>
          <p className="font-bold mt-2">Recommended: {result.recommended} regime (saves Rs.{result.savings})</p>
        </div>
      )}
    </div>
  );
}