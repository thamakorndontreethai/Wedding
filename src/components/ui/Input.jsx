import '../../index.css';
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
  <div className="app-input">
    {label && <label className="app-input__label">{label}</label>}
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
      className="app-input__control"
    />
  </div>
);
export default Input;