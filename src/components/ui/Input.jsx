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
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
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
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 outline-none"
    />
  </div>
);
export default Input;