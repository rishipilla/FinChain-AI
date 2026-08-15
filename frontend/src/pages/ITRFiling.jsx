import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import api from '../api';
import { LiquidButton } from '../components/ui/liquid-glass-button';

const emptyProfile = {
  pan: '',
  dob: '',
  fatherName: '',
  address: { flatNo: '', premisesName: '', street: '', city: '', state: '', pincode: '' },
  bankAccount: { accountNo: '', ifsc: '', accountType: 'Savings' },
  assessmentYear: '2026-27',
};

export default function ITRFiling() {
  const [profile, setProfile] = useState(emptyProfile);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const setField = (path, value) => {
    setProfile((prev) => {
      const next = { ...prev };
      if (path.includes('.')) {
        const [group, key] = path.split('.');
        next[group] = { ...next[group], [key]: value };
      } else {
        next[path] = value;
      }
      return next;
    });
  };

  const saveAndGenerate = async () => {
    setSaving(true);
    setError('');
    setResult(null);

    try {
      await api.post('/itr/profile', profile);
      const res = await api.post('/itr/generate', {});
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not generate the ITR JSON. Check the required fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-slate-200">
      <h1 className="text-3xl font-bold mb-2">ITR Filing Assistant</h1>
      <p className="text-sm text-slate-400 mb-6">
        FinChain AI does not submit returns directly to the Income Tax portal. The portal requires
        your own login and OTP verification. This feature prepares a download-ready pre-fill JSON for
        you to review and import yourself.
      </p>

      <div className="bg-base-panel border border-base-border rounded-xl p-5 mb-6 space-y-4 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-slate-300">PAN</label>
            <input
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-brand-teal"
              placeholder="ABCDE1234F"
              value={profile.pan}
              onChange={(e) => setField('pan', e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-300">Date of Birth</label>
            <input
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-brand-teal"
              placeholder="DD/MM/YYYY"
              value={profile.dob}
              onChange={(e) => setField('dob', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-300">Father's Name</label>
          <input
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-brand-teal"
            value={profile.fatherName}
            onChange={(e) => setField('fatherName', e.target.value)}
          />
        </div>

        <fieldset className="border border-white/10 rounded-lg p-3">
          <legend className="px-1 text-sm text-slate-300">Address</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" placeholder="Flat / House No." value={profile.address.flatNo} onChange={(e) => setField('address.flatNo', e.target.value)} />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" placeholder="Premises / Building" value={profile.address.premisesName} onChange={(e) => setField('address.premisesName', e.target.value)} />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" placeholder="Street" value={profile.address.street} onChange={(e) => setField('address.street', e.target.value)} />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" placeholder="City" value={profile.address.city} onChange={(e) => setField('address.city', e.target.value)} />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" placeholder="State" value={profile.address.state} onChange={(e) => setField('address.state', e.target.value)} />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" placeholder="PIN Code" value={profile.address.pincode} onChange={(e) => setField('address.pincode', e.target.value)} />
          </div>
        </fieldset>

        <fieldset className="border border-white/10 rounded-lg p-3">
          <legend className="px-1 text-sm text-slate-300">Bank Account</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" placeholder="Account No." value={profile.bankAccount.accountNo} onChange={(e) => setField('bankAccount.accountNo', e.target.value)} />
            <input className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm uppercase" placeholder="IFSC" value={profile.bankAccount.ifsc} onChange={(e) => setField('bankAccount.ifsc', e.target.value.toUpperCase())} />
            <select className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm" value={profile.bankAccount.accountType} onChange={(e) => setField('bankAccount.accountType', e.target.value)}>
              <option>Savings</option>
              <option>Current</option>
            </select>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm mb-1 text-slate-300">Assessment Year</label>
          <input
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-brand-teal"
            value={profile.assessmentYear}
            onChange={(e) => setField('assessmentYear', e.target.value)}
          />
        </div>

        <LiquidButton
          onClick={saveAndGenerate}
          disabled={saving}
          className="w-full justify-center px-5 py-3 text-base font-semibold text-white"
        >
          <span>{saving ? 'Generating...' : 'Generate ITR Pre-fill JSON'}</span>
          {!saving && <ArrowRight className="h-4 w-4" />}
        </LiquidButton>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="bg-base-panel border border-base-border rounded-xl p-5 shadow-card">
          <p className="font-semibold mb-2">Pre-fill JSON generated</p>
          <p className="text-sm text-slate-400 mb-3">{result.msg}</p>
          <p className="text-sm">Old Regime Tax: ₹{result.taxSummary.oldRegimeTax.toLocaleString('en-IN')}</p>
          <p className="text-sm">New Regime Tax: ₹{result.taxSummary.newRegimeTax.toLocaleString('en-IN')}</p>
          <p className="text-sm font-medium mt-2">Recommended: {result.taxSummary.recommended} regime</p>

          <div className="flex gap-3 mt-4 flex-wrap">
            <a href={`http://localhost:5000${result.downloadPath}`} download className="bg-green-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-medium">Download ITR JSON</a>
            <a href={result.portalUrl} target="_blank" rel="noreferrer" className="border border-white/15 px-4 py-2 rounded-lg text-sm">Open Income Tax Portal</a>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Use the downloaded JSON only as a review/import aid after logging in to the official portal.
            FinChain AI never stores or accesses your tax portal login credentials.
          </p>
        </div>
      )}
    </div>
  );
}
