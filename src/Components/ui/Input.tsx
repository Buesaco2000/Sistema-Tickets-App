interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  id?: string;
}

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  error,
  id = label.toLowerCase().replace(/\s/g, '-')
}: InputProps) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={id}
        className={`form-control w-100 ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <div id={`${id}-error`} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
}
