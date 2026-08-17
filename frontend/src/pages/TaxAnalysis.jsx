import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, ShieldCheck } from 'lucide-react';

export default function TaxAnalysis() {
  return (
    <main className="min-h-screen bg-base-bg p-6 text-slate-100 md:p-10">
      <section className="mx-auto max-w-3xl rounded-2xl border border-base-border bg-base-panel p-8 shadow-card">
        <Calculator className="text-brand-teal" size={30} />
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-brand-teal">Tax analysis</p>
        <h1 className="mt-2 text-3xl font-bold">Prepare your tax details</h1>
        <p className="mt-3 text-slate-300">Add your filing details to generate an estimated tax summary and review the recommended ITR form.</p>
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-teal/25 bg-brand-teal/10 p-4 text-sm text-slate-200">
          <ShieldCheck className="shrink-0 text-brand-teal" size={20} />
          Estimates are for planning only—review all figures before filing.
        </div>
        <Link to="/itr" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-3 text-sm font-semibold text-slate-950">
          Start ITR filing <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
