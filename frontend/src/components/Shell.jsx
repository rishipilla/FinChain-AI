import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', hint: '01' },
  { to: '/tax', label: 'Tax Estimator', hint: '02' },
  { to: '/itr', label: 'ITR Filing', hint: '03' },
  { to: '/chat', label: 'Chatbot', hint: '04' },
  { to: '/report', label: 'Reports', hint: '05' },
];

export default function Shell() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="w-64 shrink-0 border-r border-line bg-paper flex flex-col">
        <div className="px-6 py-6 border-b border-line">
          <Logo size="sm" />
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-vault text-paper'
                    : 'text-ink/70 hover:bg-vault-light hover:text-ink'
                }`
              }
            >
              <span className="font-mono text-[10px] opacity-60">{item.hint}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-6 border-t border-line">
          <button
            onClick={logout}
            className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-brick hover:bg-brick-light text-left transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
