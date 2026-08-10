export default function Topbar({ title, subtitle, user }) {
  return (
    <header className="flex items-center justify-between px-8 h-[72px] border-b border-base-border sticky top-0 bg-base-bg/95 backdrop-blur z-10">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <img
        src={user?.avatarUrl || 'https://i.pravatar.cc/64?img=12'}
        alt=""
        className="w-10 h-10 rounded-full object-cover border border-base-border"
      />
    </header>
  );
}
