export default function Topbar({ title, subtitle, user, profile }) {
  const bank = profile?.bank || {};
  const pan = profile?.pan || 'PAN not saved';
  const bankLabel = bank.bankName ? `${bank.bankName} •••• ${String(bank.accountNo || '').slice(-4)}` : 'Bank not linked';

  return (
    <header className="sticky top-0 z-10 h-[90px] border-b border-base-border bg-base-bg/90 px-8 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-brand-teal">FinChain AI</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-brand-teal/25 bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 px-4 py-2 md:block">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-teal/15 text-brand-teal flex items-center justify-center font-bold">PAN</div>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">PAN</p>
                <p className="text-sm font-medium text-slate-100">{pan}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3 border-t border-white/10 pt-2">
              <div className="h-7 w-7 rounded-lg bg-brand-blue/15 text-brand-blue flex items-center justify-center text-[10px] font-bold">B</div>
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">Bank</p>
                <p className="text-xs text-slate-300">{bankLabel}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-base-border bg-white/5 px-2 py-1.5 shadow-card">
            <img
              src={user?.avatarUrl || 'https://i.pravatar.cc/64?img=12'}
              alt=""
              className="h-11 w-11 rounded-full border border-base-border object-cover"
            />
            <div className="text-right">
              <div className="text-sm font-medium text-white">{user?.name || 'Demo User'}</div>
              <div className="text-[11px] text-slate-400">{user?.email || 'demo@finchain.ai'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
