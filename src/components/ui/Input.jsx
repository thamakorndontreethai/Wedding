const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  required = false,
  pattern,
  maxLength,
  inputMode,
}) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      required={required}
      pattern={pattern}
      maxLength={maxLength}
      inputMode={inputMode}
      className="w-full px-3.5 py-2.5 border border-slate-300 bg-white rounded-xl text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
    />
  </div>
);
export default Input;