import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';

const DEMO_USER = {
  name: 'Demo',
  email: 'demo@finchain.ai',
  avatarUrl: 'https://i.pravatar.cc/64?img=12',
};

function PlaceholderPage({ title }) {
  return (
    <div className="flex-1 min-w-0 flex items-center justify-center">
      <div className="text-center text-slate-400">
        <p className="text-lg font-medium text-slate-200">{title}</p>
        <p className="text-sm mt-1">This page hasn't been built yet.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState('Dashboard');

  return (
    <div className="flex min-h-screen bg-base-bg text-slate-100">
      <Sidebar active={active} onNavigate={setActive} user={DEMO_USER} />
      {active === 'Dashboard' ? <Dashboard /> : <PlaceholderPage title={active} />}
    </div>
  );
}
