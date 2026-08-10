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
      className={`bg-base-card border border-base-border ${a.border} border-l-4 rounded-xl p-5 shadow-card`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs tracking-wider text-slate-400 font-medium uppercase">
          {label}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.iconBg}`}>
            <Icon size={16} className={a.iconText} />
          </div>
        )}
      </div>

      <div className="mt-4 text-[26px] font-semibold leading-none">{value}</div>

      {(trendLabel || trendSuffix) && (
        <div className="mt-3 flex items-center gap-1 text-[13px]">
          <TrendIcon size={14} className={trendColor} />
          {trendLabel && <span className={`font-medium ${trendColor}`}>{trendLabel}</span>}
          {trendSuffix && <span className="text-slate-400">{trendSuffix}</span>}
        </div>
      )}
    </div>
  );
}
