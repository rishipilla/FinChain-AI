export default function Logo({ dark = false, size = 'md' }) {
  const text = dark ? 'text-paper' : 'text-ink';
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };
  return (
    <div className={`flex items-center gap-2 font-display font-semibold ${sizes[size]} ${text}`}>
      <span
        className={`flex items-center justify-center rounded-md ${
          dark ? 'bg-paper text-vault-dark' : 'bg-vault text-paper'
        }`}
        style={{ width: '1.6em', height: '1.6em', fontSize: '0.62em', fontFamily: 'IBM Plex Mono, monospace' }}
      >
        Fx
      </span>
      FinChain <span className={dark ? 'text-brass' : 'text-vault'}>AI</span>
    </div>
  );
}
