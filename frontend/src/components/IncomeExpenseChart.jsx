import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { month: 'Mar', income: 68000, expense: 38000 },
  { month: 'Apr', income: 72000, expense: 41000 },
  { month: 'May', income: 65000, expense: 36000 },
  { month: 'Jun', income: 78000, expense: 48250 },
];

export default function IncomeExpenseChart() {
  return (
    <section className="rounded-2xl border border-base-border bg-base-panel p-5 shadow-card">
      <h2 className="text-lg font-semibold text-white">Income vs expense</h2>
      <p className="mt-1 text-sm text-slate-400">Last four months</p>
      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6}>
            <CartesianGrid vertical={false} stroke="#1f2c45" />
            <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
            <Bar dataKey="income" name="Income" fill="#2dd4bf" radius={[5, 5, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
