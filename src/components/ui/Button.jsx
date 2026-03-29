import '../../index.css';
const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
}) => {
  const base = 'px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-rose-200 to-amber-200 text-stone-900 border border-rose-300/80 hover:from-rose-300 hover:to-amber-300 hover:-translate-y-0.5 focus-visible:ring-rose-300',
    secondary: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 hover:-translate-y-0.5 focus-visible:ring-slate-300',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 hover:-translate-y-0.5 focus-visible:ring-red-300',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;