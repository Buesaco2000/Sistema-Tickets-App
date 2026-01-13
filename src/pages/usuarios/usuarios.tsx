import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../Components/layout/Header";
import { RegisterForm, useRegisterForm } from "../../hooks/useRegisterForm";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

export default function FormUsuarioPage() {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const {
    form,
    cargos,
    municipios,
    roles,
    loading,
    updateField,
    handleSubmit,
  } = useRegisterForm();

  return (
    <Box m="20px">
      <Header title="USUARIO" subtitle="Datos del Usuario" />

      <Formik<RegisterForm>
        initialValues={form}
        validationSchema={usuarioSchema}
        onSubmit={async (_values, actions) => {
          const success = await handleSubmit(true);
          if (success) {
            setSnackbarMessage("Usuario registrado correctamente");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            actions.resetForm();
            setTimeout(() => navigate("/dashboard/usuarios"), 500);
          } else {
            setSnackbarMessage("Error al registrar usuario");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          }
        }}
        enableReinitialize
      >
        {({ handleSubmit: formikSubmit, handleBlur }) => (
          <form onSubmit={formikSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                label="Nombre"
                variant="filled"
                value={form.nombres}
                onBlur={handleBlur}
                onChange={(e) => updateField("nombres", e.target.value)}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Apellido"
                variant="filled"
                name="apellido"
                value={form.apellidos}
                onBlur={handleBlur}
                onChange={(e) => updateField("apellidos", e.target.value)}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Correo"
                variant="filled"
                name="email"
                value={form.email}
                onBlur={handleBlur}
                onChange={(e) => updateField("email", e.target.value)}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                label="Teléfono"
                variant="filled"
                name="telefono"
                value={form.telefono}
                onBlur={handleBlur}
                onChange={(e) => updateField("telefono", e.target.value)}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                select
                fullWidth
                label="Cargo"
                variant="filled"
                name="cargoId"
                value={form.cargoId}
                onBlur={handleBlur}
                onChange={(e) => updateField("cargoId", e.target.value)}
                sx={{ gridColumn: "span 2" }}
              >
                {cargos.map((cargo) => (
                  <MenuItem key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="Municipio"
                variant="filled"
                name="municipioId"
                value={form.municipioId}
                onBlur={handleBlur}
                onChange={(e) => updateField("municipioId", e.target.value)}
                sx={{ gridColumn: "span 2" }}
              >
                {municipios.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                label="ROL"
                variant="filled"
                name="rolId"
                value={form.rolId}
                onBlur={handleBlur}
                onChange={(e) => updateField("rolId", e.target.value)}
                sx={{ gridColumn: "span 4" }}
              >
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.nombre}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                variant="filled"
                name="password"
                value={form.password}
                onBlur={handleBlur}
                onChange={(e) => updateField("password", e.target.value)}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                type="password"
                label="Repetir Contraseña"
                variant="filled"
                name="repeatPassword"
                value={form.repeatPassword}
                onBlur={handleBlur}
                onChange={(e) => updateField("repeatPassword", e.target.value)}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading}
              >
                Crear Usuario
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const usuarioSchema = yup.object({
  nombres: yup.string().required(),
  apellidos: yup.string().required(),
  email: yup.string().email().required(),
  telefono: yup.string().required(),
  cargoId: yup.string().required(),
  municipioId: yup.string().required(),
  password: yup.string().min(8).required(),
  repeatPassword: yup.string().oneOf([yup.ref("password")]),
});
