import { Wallet, CreditCard, PiggyBank, Percent, HeartPulse, ShieldCheck } from 'lucide-react';
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

export default function Dashboard() {
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
      <Topbar title="Dashboard" subtitle={today} />

      <main className="p-8 space-y-6">
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
