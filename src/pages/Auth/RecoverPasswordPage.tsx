import { useState } from "react";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import { Link } from "react-router-dom";
import { recoverPasswordRequest } from "../../services/auth/authApi";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("El correo es obligatorio");
      return;
    }

    setLoading(true);
    const res = await recoverPasswordRequest(email);
    setLoading(false);

    if (!res.ok) {
      setError(res.error || "No fue posible enviar el correo");
      return;
    }

    setMessage("Hemos enviado un enlace de recuperación a tu correo.");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "420px" }}>
        <h3 className="text-center mb-3">Recuperar contraseña</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Correo electrónico"
            value={email}
            type="email"
            onChange={setEmail}
          />

          <div className="d-grid mt-3">
            <Button text="Enviar enlace" loading={loading} />
          </div>

          <div className="text-center mt-3">
            <Link to="/">Volver al inicio de sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
