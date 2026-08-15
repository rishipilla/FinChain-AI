import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../api';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const bucketLabels = {
  salary: 'Salary',
  business: 'Business / Freelance',
  interest: 'Interest',
  dividend: 'Dividends',
  rental: 'Rental',
  capitalGains: 'Capital Gains',
  otherIncome: 'Other Income',
  section80C: 'Section 80C',
  section80D: 'Section 80D',
  section80TTA: 'Section 80TTA',
  homeLoanInterest: 'Home Loan Interest',
};

export default function ITRDraft() {
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/itr/draft')
      .then((res) => setDraft(res.data))
      .catch((err) => setError(err.response?.data?.msg || err.message));
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-bg p-6 text-slate-100">
        <div className="max-w-xl rounded-2xl border border-red-500/30 bg-base-panel p-6 shadow-card">
          <p className="text-sm uppercase tracking-[0.2em] text-red-300">Draft unavailable</p>
          <h1 className="mt-3 text-2xl font-bold">Could not load your ITR draft</h1>
          <p className="mt-2 text-slate-300">{error}</p>
          <Link
            to="/dashboard"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-slate-950"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-bg text-slate-200">
        <div className="text-center">
          <Sparkles className="mx-auto mb-3 text-brand-teal" size={28} />
          <p className="text-lg font-medium">Analyzing your transactions…</p>
        </div>
      </div>
    );
  }

  const incomeEntries = Object.entries(draft.income.byBucket || {}).filter(([, value]) => Number(value) > 0);
  const deductionEntries = Object.entries(draft.deductions.byBucket || {}).filter(([, value]) => Number(value) > 0);

  return (
    <div className="min-h-screen bg-base-bg text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <ArrowLeft size={16} /> Back to dashboard
          </Link>
          <span className="rounded-full border border-brand-teal/40 bg-brand-teal/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-teal">
            {draft.formConfidence} confidence
          </span>
        </div>

        <div className="mb-6 rounded-2xl border border-base-border bg-base-panel p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recommended ITR Form</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{draft.recommendedITRForm}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">{draft.formRecommendationReason}</p>
            </div>
            <div className="rounded-xl border border-base-border bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-brand-teal" size={16} />
                {draft.needsCAReview ? 'CA review recommended' : 'No CA review required'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-base-border bg-base-panel p-4 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total income</p>
            <p className="mt-3 text-2xl font-bold text-brand-teal">{fmt(draft.income.totalIncome)}</p>
          </div>
          <div className="rounded-2xl border border-base-border bg-base-panel p-4 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total deductions</p>
            <p className="mt-3 text-2xl font-bold text-brand-blue">{fmt(draft.deductions.totalDeductions)}</p>
          </div>
          <div className="rounded-2xl border border-base-border bg-base-panel p-4 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Estimated tax</p>
            <p className="mt-3 text-2xl font-bold text-brand-gold">{fmt(draft.tax.estimatedTax)}</p>
          </div>
          <div className="rounded-2xl border border-base-border bg-base-panel p-4 shadow-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">TDS detected</p>
            <p className="mt-3 text-2xl font-bold text-brand-green">{fmt(draft.tds.detected)}</p>
          </div>
        </div>

        <div
          className={`mt-6 rounded-2xl border p-5 text-center text-lg font-semibold ${
            draft.refundOrPayable.direction === 'refund'
              ? 'border-brand-green/30 bg-brand-green/10 text-brand-green'
              : 'border-brand-red/30 bg-brand-red/10 text-brand-red'
          }`}
        >
          {draft.refundOrPayable.direction === 'refund' ? 'Estimated refund due' : 'Estimated tax payable'}
          <div className="mt-2 text-3xl">{fmt(draft.refundOrPayable.amount)}</div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-base-border bg-base-panel p-5 shadow-card">
            <h2 className="mb-4 text-lg font-semibold">Income breakdown</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {incomeEntries.length === 0 && <li className="text-slate-500">No income detected yet.</li>}
              {incomeEntries.map(([key, value]) => (
                <li key={key} className="flex items-center justify-between border-b border-base-border pb-2">
                  <span>{bucketLabels[key] || key}</span>
                  <span className="font-medium text-white">{fmt(value)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-base-border bg-base-panel p-5 shadow-card">
            <h2 className="mb-4 text-lg font-semibold">Deductions breakdown</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {deductionEntries.length === 0 && <li className="text-slate-500">No deductions detected yet.</li>}
              {deductionEntries.map(([key, value]) => (
                <li key={key} className="flex items-center justify-between border-b border-base-border pb-2">
                  <span>{bucketLabels[key] || key}</span>
                  <span className="font-medium text-white">{fmt(value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-base-border bg-slate-950/50 p-5 text-sm text-slate-300 shadow-card">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-brand-teal" size={18} />
            <p>{draft.disclaimer}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to="/itr"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Back to filing form
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
