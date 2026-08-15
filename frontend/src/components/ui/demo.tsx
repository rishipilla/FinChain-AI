import { LiquidButton } from "@/components/ui/liquid-glass-button";

export default function DemoOne() {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 p-6">
      <LiquidButton className="px-8 py-3 text-base font-semibold tracking-wide text-white">
        Liquid Glass
      </LiquidButton>
    </div>
  );
}
