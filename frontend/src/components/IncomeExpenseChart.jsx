import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', income: 118000, expense: 42000 },
  { month: 'Feb', income: 116000, expense: 38000 },
  { month: 'Mar', income: 132000, expense: 41000 },
  { month: 'Apr', income: 126000, expense: 46000 },
  { month: 'May', income: 124000, expense: 44000 },
  { month: 'Jun', income: 125000, expense: 47000 },
  { month: 'Jul', income: 125000, expense: 48250 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-panel border border-base-border rounded-lg px-3 py-2 text-xs shadow-card">
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.stroke }} />
          <span className="capitalize text-slate-300">{p.dataKey}:</span>
          <span className="font-medium text-white">
            ₹{p.value.toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function IncomeExpenseChart() {
  return (
    <div className="bg-base-card border border-base-border rounded-xl p-6 shadow-card">
      <h3 className="text-[15px] font-semibold mb-4">Income vs Expense Trend</h3>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2c45" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `₹${v / 1000}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#incomeFill)" />
            <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expenseFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
