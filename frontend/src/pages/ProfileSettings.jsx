import { useEffect, useState } from 'react';
import { Save, UserCircle2, Landmark, Bell, Palette, ShieldCheck } from 'lucide-react';
import api from '../api';

const defaultProfile = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  pan: '',
  aadhaar: '',
  fatherName: '',
  address: {
    flatNo: '',
    premisesName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  },
  bank: {
    bankName: '',
    accountHolderName: '',
    accountNo: '',
    ifsc: '',
    accountType: 'Savings',
    isLinked: false,
  },
  emergencyContact: {
    name: '',
    phone: '',
    relation: '',
  },
};

const defaultSettings = {
  notifications: true,
  emailAlerts: true,
  smsAlerts: false,
  autoSync: true,
  lowBalanceAlert: true,
  theme: 'dark',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  language: 'English',
};

export default function ProfileSettings() {
  const [profile, setProfile] = useState(defaultProfile);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const hydrateFromBackend = async () => {
    try {
      const res = await api.get('/profile');
      const nextProfile = { ...defaultProfile, ...(res.data.profile || {}) };
      nextProfile.address = { ...defaultProfile.address, ...(res.data.profile?.address || {}) };
      nextProfile.bank = { ...defaultProfile.bank, ...(res.data.profile?.bank || {}) };
      nextProfile.emergencyContact = { ...defaultProfile.emergencyContact, ...(res.data.profile?.emergencyContact || {}) };

      if (!nextProfile.email) nextProfile.email = res.data.email || '';
      if (!nextProfile.fullName) nextProfile.fullName = res.data.name || '';

      setProfile(nextProfile);
      setSettings({ ...defaultSettings, ...(res.data.settings || {}) });

      localStorage.setItem(
        'user',
        JSON.stringify({
          name: nextProfile.fullName || res.data.name || 'Demo',
          email: nextProfile.email || res.data.email || 'demo@finchain.ai',
        })
      );
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Unable to load profile.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateFromBackend();
  }, []);

  const updateProfileField = (path, value) => {
    setProfile((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let ref = next;
      for (let i = 0; i < keys.length - 1; i += 1) {
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateSettingsField = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        name: profile.fullName,
        profile,
        settings,
      };

      await api.put('/profile', payload);
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: profile.fullName || 'Demo',
          email: profile.email || 'demo@finchain.ai',
        })
      );
      setMessage({ type: 'success', text: 'Profile and settings saved successfully.' });
      await hydrateFromBackend();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Could not save profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-300">Loading profile…</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-slate-100">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-teal">Your account</p>
          <h1 className="mt-2 text-3xl font-bold">Profile & Settings</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-4 py-2.5 text-sm font-semibold text-slate-950"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-brand-teal/30 bg-brand-teal/10 text-brand-teal'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-base-border bg-base-panel p-5 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <UserCircle2 className="text-brand-teal" />
            <h2 className="text-lg font-semibold">Personal details</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.fullName} onChange={(e) => updateProfileField('fullName', e.target.value)} placeholder="Full name" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.email} onChange={(e) => updateProfileField('email', e.target.value)} placeholder="Email" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.phone} onChange={(e) => updateProfileField('phone', e.target.value)} placeholder="Phone" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" type="date" value={profile.dob} onChange={(e) => updateProfileField('dob', e.target.value)} />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm uppercase" value={profile.pan} onChange={(e) => updateProfileField('pan', e.target.value.toUpperCase())} placeholder="PAN" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.aadhaar} onChange={(e) => updateProfileField('aadhaar', e.target.value)} placeholder="Aadhaar" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm md:col-span-2" value={profile.fatherName} onChange={(e) => updateProfileField('fatherName', e.target.value)} placeholder="Father's name" />
          </div>
        </section>

        <section className="rounded-2xl border border-base-border bg-base-panel p-5 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <Landmark className="text-brand-blue" />
            <h2 className="text-lg font-semibold">Bank & address</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm md:col-span-2" value={profile.address.flatNo} onChange={(e) => updateProfileField('address.flatNo', e.target.value)} placeholder="Flat / House no." />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm md:col-span-2" value={profile.address.premisesName} onChange={(e) => updateProfileField('address.premisesName', e.target.value)} placeholder="Premises / Building" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm md:col-span-2" value={profile.address.street} onChange={(e) => updateProfileField('address.street', e.target.value)} placeholder="Street" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.address.city} onChange={(e) => updateProfileField('address.city', e.target.value)} placeholder="City" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.address.state} onChange={(e) => updateProfileField('address.state', e.target.value)} placeholder="State" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.address.pincode} onChange={(e) => updateProfileField('address.pincode', e.target.value)} placeholder="PIN" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm md:col-span-2" value={profile.address.country} onChange={(e) => updateProfileField('address.country', e.target.value)} placeholder="Country" />

            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.bank.bankName} onChange={(e) => updateProfileField('bank.bankName', e.target.value)} placeholder="Bank name" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.bank.accountHolderName} onChange={(e) => updateProfileField('bank.accountHolderName', e.target.value)} placeholder="Account holder" />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.bank.accountNo} onChange={(e) => updateProfileField('bank.accountNo', e.target.value)} placeholder="Account no." />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm uppercase" value={profile.bank.ifsc} onChange={(e) => updateProfileField('bank.ifsc', e.target.value.toUpperCase())} placeholder="IFSC" />
            <select className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.bank.accountType} onChange={(e) => updateProfileField('bank.accountType', e.target.value)}>
              <option>Savings</option>
              <option>Current</option>
            </select>
            <label className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
              <input type="checkbox" checked={profile.bank.isLinked} onChange={(e) => updateProfileField('bank.isLinked', e.target.checked)} />
              Linked
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-base-border bg-base-panel p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <Bell className="text-brand-gold" />
            <h2 className="text-lg font-semibold">Preferences & notifications</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ['notifications', 'Notifications'],
              ['emailAlerts', 'Email alerts'],
              ['smsAlerts', 'SMS alerts'],
              ['autoSync', 'Auto sync'],
              ['lowBalanceAlert', 'Low balance alert'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200">
                <span>{label}</span>
                <input type="checkbox" checked={settings[key]} onChange={(e) => updateSettingsField(key, e.target.checked)} />
              </label>
            ))}

            <select className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={settings.theme} onChange={(e) => updateSettingsField('theme', e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>

            <select className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={settings.currency} onChange={(e) => updateSettingsField('currency', e.target.value)}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>

            <select className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={settings.timezone} onChange={(e) => updateSettingsField('timezone', e.target.value)}>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
            </select>

            <select className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={settings.language} onChange={(e) => updateSettingsField('language', e.target.value)}>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
}
