import { useNavigate } from "react-router-dom";
import Input from "../../Components/ui/Input";
import PasswordInput from "../../Components/ui/PasswordInput";
import Button from "../../Components/ui/Button";
import { useRegisterForm } from "../../hooks/useRegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    form,
    cargos,
    municipios,
    loading,
    error,
    updateField,
    handleSubmit,
  } = useRegisterForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      navigate("/auth"); // Redirige al dashboard después del registro
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* FILA 1 */}
      <div className="row g-3">
        <div className="col-6">
          <Input
            label="Nombre"
            value={form.nombres}
            onChange={(v) => updateField("nombres", v)}
          />
        </div>
        <div className="col-6">
          <Input
            label="Apellido"
            value={form.apellidos}
            onChange={(v) => updateField("apellidos", v)}
          />
        </div>
      </div>

      {/* FILA 2 */}
      <div className="row g-3 mt-1">
        <div className="col-6">
          <label className="form-label">Cargo</label>
          <select
            className="form-select"
            value={form.cargoId}
            onChange={(e) => updateField("cargoId", e.target.value)}
          >
            <option value="">Seleccione un cargo</option>
            {cargos &&
              Array.isArray(cargos) &&
              cargos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
          </select>
        </div>

        <div className="col-6">
          <label className="form-label">Municipio</label>
          <select
            className="form-select"
            value={form.municipioId}
            onChange={(e) => updateField("municipioId", e.target.value)}
          >
            <option value="">Seleccione un municipio</option>
            {municipios &&
              Array.isArray(municipios) &&
              municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* FILA 3 */}
      <div className="row g-3 mt-1">
        <div className="col-6">
          <Input
            label="Correo electrónico"
            value={form.email}
            type="email"
            onChange={(v) => updateField("email", v)}
          />
        </div>
        <div className="col-6">
          <Input
            label="Telefono"
            value={form.telefono}
            onChange={(v) => updateField("telefono", v)}
          />
        </div>
      </div>

      {/* FILA 4 */}
      <div className="row g-3 mt-1">
        <div className="col-6">
          <PasswordInput
            label="Contraseña"
            value={form.password}
            onChange={(v) => updateField("password", v)}
          />
        </div>
        <div className="col-6">
          <PasswordInput
            label="Repetir contraseña"
            value={form.repeatPassword}
            onChange={(v) => updateField("repeatPassword", v)}
          />
        </div>
      </div>

      <div className="d-grid mt-4">
        <Button text="Crear cuenta" loading={loading} type="submit" />
      </div>
    </form>
  );
}
