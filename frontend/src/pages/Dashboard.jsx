import { Wallet, CreditCard, PiggyBank, Percent, HeartPulse, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import TargetCursor from '../components/TargetCursor.jsx';
import Topbar from '../components/Topbar.jsx';
import StatCard from '../components/StatCard.jsx';
import IncomeExpenseChart from '../components/IncomeExpenseChart.jsx';
import ExpenseDonut from '../components/ExpenseDonut.jsx';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function Dashboard({ user }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api
      .get('/itr/summary')
      .then((res) => setSummary(res.data))
      .catch(() => setSummary(null));
  }, []);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const profile = user?.profile || {};
  const pan = profile.pan || 'PAN not saved';
  const bank = profile.bank || {};
  const bankLabel = bank.bankName ? `${bank.bankName} •••• ${String(bank.accountNo || '').slice(-4)}` : 'Bank not linked';

  return (
    <div className="flex-1 min-w-0">
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
        cursorColor="#10b981"
        cursorColorOnTarget="#B497CF"
      />
      <Topbar title="Dashboard" subtitle={today} user={user} profile={profile} />

      <main className="p-8 space-y-6">
        {summary && summary.ready && (
          <div className="rounded-2xl border border-brand-teal/25 bg-gradient-to-r from-brand-teal/10 via-slate-900/80 to-brand-blue/10 p-5 shadow-[0_18px_50px_-28px_rgba(45,212,191,0.8)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] text-brand-teal">One-click ITR filing</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Your ITR is ready</h2>
                <p className="mt-2 text-sm text-slate-300">
                  {summary.transactionsAnalyzed} transactions analyzed • {summary.recommendedITRForm}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Estimated tax</p>
                  <p className="text-lg font-semibold text-white">{fmt(summary.estimatedTax)}</p>
                </div>
                <Link
                  to="/itr/draft"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-teal to-brand-blue px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-teal/20 transition-transform hover:-translate-y-0.5"
                >
                  Review draft
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cursor-target"><StatCard label="Total Income" value="₹1,25,000" icon={Wallet} accent="teal" trend="up" trendLabel="+12%" trendSuffix="vs last month" /></div>
          <div className="cursor-target"><StatCard label="Total Expense" value="₹48,250" icon={CreditCard} accent="red" trend="down" trendLabel="-4%" trendSuffix="vs last month" /></div>
          <div className="cursor-target"><StatCard label="Total Savings" value="₹76,750" icon={PiggyBank} accent="blue" trend="up" trendLabel="+21%" trendSuffix="vs last month" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cursor-target"><StatCard label="Estimated Tax" value="₹18,200" icon={Percent} accent="gold" trend="flat" trendLabel="0%" trendSuffix="New Regime base" /></div>
          <div className="cursor-target"><StatCard label="Financial Health" value="84 / 100" icon={HeartPulse} accent="purple" trend="up" trendLabel="+2 pts" trendSuffix="Grade: Excellent" /></div>
          <div className="cursor-target"><StatCard label="Blockchain Status" value="Synchronized" icon={ShieldCheck} accent="cyan" trend="flat" trendSuffix="Secured Block #19,048,231" /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeExpenseChart />
          <ExpenseDonut />
        </div>
      </main>
    </div>
  );
}
