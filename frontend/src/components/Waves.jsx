export default function Waves({ lineColor = 'rgba(16, 185, 129, 0.3)', backgroundColor = '#05070d' }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-70"
      style={{
        backgroundColor,
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0 34px, ${lineColor} 35px 36px), repeating-linear-gradient(90deg, transparent 0 34px, ${lineColor} 35px 36px)`,
        maskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
      }}
    />
  );
}
