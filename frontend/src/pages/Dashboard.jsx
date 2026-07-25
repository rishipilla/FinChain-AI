import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

// Mock data shown until the real API responds -- Kruthi can swap this
// out once /api/dashboard is live.
const mockData = {
  totalCredit: 50000, totalDebit: 32000, balance: 18000,
  spendingByCategory: { food: 8000, rent: 15000, travel: 4000, other: 5000 }
};

export default function Dashboard() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data)).catch(() => {});
  }, []);

  const chartData = Object.entries(data.spendingByCategory || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Income</p>
          <p className="text-xl font-bold text-green-600">Rs.{data.totalCredit}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Expenses</p>
          <p className="text-xl font-bold text-red-600">Rs.{data.totalDebit}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <p className="text-gray-500 text-sm">Balance</p>
          <p className="text-xl font-bold">Rs.{data.balance}</p>
        </div>
      </div>
      <div className="bg-white shadow rounded-xl p-4" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} label>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}