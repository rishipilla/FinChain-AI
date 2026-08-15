import {
  LayoutDashboard,
  CreditCard,
  PieChart,
  Bot,
  Lightbulb,
  UploadCloud,
  Link2,
  FileDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Transactions', icon: CreditCard },
  { label: 'Tax Analysis', icon: PieChart },
  { label: 'ITR Filing', icon: FileDown },
  { label: 'AI Assistant', icon: Bot },
  { label: 'AI Insights', icon: Lightbulb },
  { label: 'Upload Statement', icon: UploadCloud },
  { label: 'Blockchain', icon: Link2 },
  { label: 'Reports', icon: FileDown },
  { label: 'Profile', icon: User },
  { label: 'Settings', icon: Settings },
];

export default function Sidebar({ active, onNavigate, user }) {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-base-panel border-r border-base-border">
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-base-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center text-sm font-bold text-base-bg">
          F
        </div>
        <div className="text-[15px] font-semibold tracking-wide">
          FinChain <span className="text-brand-teal">AI</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => onNavigate?.(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${
                  isActive
                    ? 'bg-brand-teal/10 text-brand-teal font-medium'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-base-border p-3 flex items-center gap-3">
        <img
          src={user?.avatarUrl || 'https://i.pravatar.cc/64?img=12'}
          alt=""
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{user?.name || 'Demo'}</div>
          <div className="text-xs text-slate-400 truncate">
            {user?.email || 'demo@finchain.ai'}
          </div>
        </div>
        <button className="text-slate-400 hover:text-white" aria-label="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
