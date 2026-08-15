import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const ACCENTS = {
  teal: { border: 'border-l-brand-teal', iconBg: 'bg-brand-teal/15', iconText: 'text-brand-teal' },
  red: { border: 'border-l-brand-red', iconBg: 'bg-brand-red/15', iconText: 'text-brand-red' },
  blue: { border: 'border-l-brand-blue', iconBg: 'bg-brand-blue/15', iconText: 'text-brand-blue' },
  gold: { border: 'border-l-brand-gold', iconBg: 'bg-brand-gold/15', iconText: 'text-brand-gold' },
  purple: { border: 'border-l-brand-purple', iconBg: 'bg-brand-purple/15', iconText: 'text-brand-purple' },
  cyan: { border: 'border-l-brand-cyan', iconBg: 'bg-brand-cyan/15', iconText: 'text-brand-cyan' },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'teal',
  trend = 'flat',
  trendLabel,
  trendSuffix,
}) {
  const a = ACCENTS[accent] || ACCENTS.teal;
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor =
    trend === 'up' ? 'text-brand-green' : trend === 'down' ? 'text-brand-red' : 'text-slate-400';

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_40px_-28px_rgba(56,189,248,0.8)] backdrop-blur-xl ${a.border} border-l-4`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-80" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400 font-medium">
            {label}
          </span>
          {Icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${a.iconBg}`}>
              <Icon size={16} className={a.iconText} />
            </div>
          )}
        </div>

        <div className="mt-5 text-[28px] font-semibold leading-none tracking-tight text-white">{value}</div>

        {(trendLabel || trendSuffix) && (
          <div className="mt-3 flex items-center gap-1.5 text-[12px]">
            <TrendIcon size={14} className={trendColor} />
            {trendLabel && <span className={`font-medium ${trendColor}`}>{trendLabel}</span>}
            {trendSuffix && <span className="text-slate-400">{trendSuffix}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
