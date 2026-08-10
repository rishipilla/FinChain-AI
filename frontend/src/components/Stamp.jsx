export default function Stamp({ label = 'Verified', className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border-2 border-dashed border-brass px-3 py-1 -rotate-3 select-none ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
      <span className="font-mono text-[11px] tracking-widest uppercase text-brass">{label}</span>
    </div>
  );
}
