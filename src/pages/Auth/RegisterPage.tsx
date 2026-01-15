import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../Components/ui/Input";
import PasswordInput from "../../Components/ui/PasswordInput";
import Button from "../../Components/ui/Button";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { useSnackbar } from "../../hooks/useSnackbar";
import api from "../../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { showSuccess, showError, SnackbarComponent } = useSnackbar();

  const {
    form,
    cargos,
    municipios,
    loading,
    error,
    updateField,
    handleSubmit,
    setCargos,
    resetForm,
  } = useRegisterForm();

  const [mostrarInputCargo, setMostrarInputCargo] = useState(false);
  const [nuevoCargo, setNuevoCargo] = useState("");
  const [creandoCargo, setCreandoCargo] = useState(false);

  const handleCargoChange = (value: string) => {
    if (value === "otro") {
      setMostrarInputCargo(true);
      updateField("cargoId", "");
    } else {
      setMostrarInputCargo(false);
      updateField("cargoId", value);
    }
  };

  const crearNuevoCargo = async () => {
    if (!nuevoCargo.trim()) {
      showError("Ingrese un nombre para el cargo");
      return;
    }

    setCreandoCargo(true);
    try {
      const response = await api.post("/cargos", { nombre: nuevoCargo.trim() });
      const { cargo } = response.data;

      // Agregar el nuevo cargo a la lista
      setCargos((prev) => [...prev, cargo]);

      // Seleccionar el nuevo cargo
      updateField("cargoId", cargo.id.toString());

      // Ocultar el input
      setMostrarInputCargo(false);
      setNuevoCargo("");

      showSuccess("Cargo creado correctamente");
    } catch (err) {
      showError("Error al crear el cargo");
    } finally {
      setCreandoCargo(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      resetForm();
      setMostrarInputCargo(false);
      setNuevoCargo("");
      showSuccess("Usuario creado correctamente");
      navigate("/auth");
    } else {
      showError(error);
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
          {!mostrarInputCargo ? (
            <select
              className="form-select"
              value={form.cargoId}
              onChange={(e) => handleCargoChange(e.target.value)}
            >
              <option value="">Seleccione un cargo</option>
              {cargos &&
                Array.isArray(cargos) &&
                cargos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              <option value="otro">Otro (Crear nuevo)</option>
            </select>
          ) : (
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del nuevo cargo"
                value={nuevoCargo}
                onChange={(e) => setNuevoCargo(e.target.value)}
                disabled={creandoCargo}
              />
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={crearNuevoCargo}
                disabled={creandoCargo}
              >
                {creandoCargo ? "..." : "✓"}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setMostrarInputCargo(false);
                  setNuevoCargo("");
                }}
                disabled={creandoCargo}
              >
                ✕
              </button>
            </div>
          )}
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
      {SnackbarComponent}
    </form>
  );
}
