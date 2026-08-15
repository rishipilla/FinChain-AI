import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ITRFiling from './pages/ITRFiling.jsx';
import ProfileSettings from './pages/ProfileSettings.jsx';
import api from './api';

const DEMO_USER = {
  name: 'Demo',
  email: 'demo@finchain.ai',
  avatarUrl: 'https://i.pravatar.cc/64?img=12',
};

function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : DEMO_USER;
  } catch {
    return DEMO_USER;
  }
}

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
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await api.get('/profile');
        const nextUser = {
          ...DEMO_USER,
          ...getStoredUser(),
          id: res.data?.id,
          name: res.data?.name || getStoredUser().name || DEMO_USER.name,
          email: res.data?.email || getStoredUser().email || DEMO_USER.email,
          profile: res.data?.profile || {},
          settings: res.data?.settings || {},
        };

        setUser(nextUser);
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: nextUser.name,
            email: nextUser.email,
            profile: nextUser.profile,
            settings: nextUser.settings,
          })
        );
      } catch (err) {
        console.error('Failed to load profile on app start:', err);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-base-bg text-slate-100">
      <Sidebar active={active} onNavigate={setActive} user={user} />
      {active === 'Dashboard' && <Dashboard user={user} />}
      {active === 'ITR Filing' && <ITRFiling />}
      {active === 'Profile' && <ProfileSettings />}
      {active === 'Settings' && <ProfileSettings />}
      {!['Dashboard', 'ITR Filing', 'Profile', 'Settings'].includes(active) && <PlaceholderPage title={active} />}
    </div>
  );
}
