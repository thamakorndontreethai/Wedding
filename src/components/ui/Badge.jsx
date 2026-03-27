const Badge = ({ status }) => {
  const normalized = String(status || '').toLowerCase();
  const styles = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    verified: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
    processing: 'bg-sky-50 text-sky-700 ring-sky-200',
  };

  const labels = {
    pending: 'Pending',
    verified: 'Verified',
    approved: 'Approved',
    rejected: 'Rejected',
    processing: 'Processing',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${styles[normalized] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}
    >
      {labels[normalized] || normalized || 'Unknown'}
    </span>
  );
};
export default Badge;