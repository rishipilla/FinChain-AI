import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Rent & Housing', value: 18000, color: '#3b82f6' },
  { name: 'Food & Dining', value: 9500, color: '#22c55e' },
  { name: 'Transport', value: 6200, color: '#f59e0b' },
  { name: 'Shopping', value: 7800, color: '#a855f7' },
  { name: 'Utilities', value: 4200, color: '#ef4444' },
  { name: 'Entertainment', value: 2550, color: '#06b6d4' },
  { name: 'Other', value: 3000, color: '#ec4899' },
  { name: 'Savings Transfer', value: 5000, color: '#94a3b8' },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-base-panel border border-base-border rounded-lg px-3 py-2 text-xs shadow-card">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: item.payload.color }} />
        <span className="text-slate-300">{item.name}:</span>
        <span className="font-medium text-white">
          ₹{item.value.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}

export default function ExpenseDonut() {
  return (
    <div className="bg-base-card border border-base-border rounded-xl p-6 shadow-card">
      <h3 className="text-[15px] font-semibold mb-4">Expense Categories</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
        {data.slice(0, 4).map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
}
