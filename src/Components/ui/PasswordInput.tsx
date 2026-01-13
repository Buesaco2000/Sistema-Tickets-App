import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type PasswordProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

export default function PasswordInput({
  label,
  value,
  onChange,
}: PasswordProps) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  const [show, setShow] = useState(false);
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-group">
        <input
          id={id}
          className="form-control"
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>
    </div>
  );
}
