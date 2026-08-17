import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Essentials', value: 22000, color: '#3b82f6' },
  { name: 'Lifestyle', value: 14250, color: '#a855f7' },
  { name: 'Transport', value: 7000, color: '#f59e0b' },
  { name: 'Other', value: 5000, color: '#2dd4bf' },
];

export default function ExpenseDonut() {
  return (
    <section className="rounded-2xl border border-base-border bg-base-panel p-5 shadow-card">
      <h2 className="text-lg font-semibold text-white">Expense split</h2>
      <p className="mt-1 text-sm text-slate-400">This month</p>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
              {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
            </Pie>
            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
