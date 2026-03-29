import '../../index.css';
const Badge = ({ status }) => {
  const normalized = String(status || '').toLowerCase();
  const styles = {
    pending: 'badge-yellow',
    verified: 'badge-green',
    approved: 'badge-green',
    rejected: 'badge-red',
    processing: 'badge-blue',
  };

  const labels = {
    pending: 'Pending',
    verified: 'Verified',
    approved: 'Approved',
    rejected: 'Rejected',
    processing: 'Processing',
  };

  return (
    <span className={`badge ${styles[normalized] || 'badge-gray'}`}>
      {labels[normalized] || normalized || 'Unknown'}
    </span>
  );
};
export default Badge;