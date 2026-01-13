import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "../../Components/ui/PasswordInput";
import { useLoginForm } from "../../hooks/useLoginForm";
import { useSnackbar } from "../../hooks/useSnackbar";

export default function LoginPage() {
  const navigate = useNavigate();

  const { form, loading, error, updateField, handleSubmit } = useLoginForm();

  const { showSuccess, showError, SnackbarComponent } = useSnackbar();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await handleSubmit();

      if (success) {
        showSuccess("Inicio de sesion exitoso");
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 403) {
        showError("Tu cuenta está desactivada. Contacta al administrador.");
      } else {
        showError(error || "Credenciales incorrectas");
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <Input
        label="Correo electrónico"
        value={form.email}
        onChange={(v) => updateField("email", v)}
        type="email"
      />

      <PasswordInput
        label="Contraseña"
        value={form.password}
        onChange={(v) => updateField("password", v)}
      />

      <div className="d-grid mt-3">
        <Button text="Ingresar" loading={loading} type="submit" />
      </div>

      <div className="mt-2 text-center">
        <Link
          to="/recoverPassword"
          className="text-primary fw-semibold text-decoration-none"
          style={{ fontSize: "12px" }}
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      {SnackbarComponent}
    </form>
  );
}
