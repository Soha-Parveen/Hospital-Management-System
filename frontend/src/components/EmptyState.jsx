export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="h-14 w-14 rounded-2xl bg-fg/5 border border-fg/10 flex items-center justify-center text-muted mb-4">
          <Icon size={24} strokeWidth={1.5} />
        </div>
      )}
      <p className="font-heading font-semibold text-fg">{title}</p>
      {subtitle && <p className="text-sm text-muted mt-1 max-w-sm">{subtitle}</p>}
    </div>
  );
}
