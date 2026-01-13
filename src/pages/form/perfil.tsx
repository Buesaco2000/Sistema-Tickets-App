import { Alert, Box, Button, CircularProgress, Snackbar, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../Components/layout/Header";
import { usePerfil } from "../../hooks/usePerfilForm";
import { useState } from "react";

// Constantes de roles
const ROLES = {
  ADMIN: 1,
  INGENIERO: 2,
  SALUD: 3,
};

export default function FormPerfilPage() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { user, loading, updatePerfil } = usePerfil();

  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  // Verificar si es admin
  const isAdmin = user.rol_id === ROLES.ADMIN;

  // MAPEO desde API → Form
  const initialValues = {
    nombre: user.nombres || "",
    apellido: user.apellidos || "",
    email: user.email || "",
    telefono: user.telefono || "",
    cargo: user.cargo || "",
    municipio: user.municipio || "",
    rol: user.rol || "",
  };

  // MAPEO desde Form → API (solo campos editables)
  const handleSubmit = async (values: typeof initialValues) => {
    const payload = {
      nombres: values.nombre,
      apellidos: values.apellido,
      email: values.email,
      telefono: values.telefono,
    };

    const result = await updatePerfil(payload);

    setSnackbar({
      open: true,
      message: result.message,
      severity: result.success ? "success" : "error",
    });
  };

  return (
    <Box m="20px">
      <Header title="PERFIL" subtitle="Datos del Perfil" />

      <Formik
        initialValues={initialValues}
        validationSchema={perfilSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
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
                name="nombre"
                value={values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.nombre && !!errors.nombre}
                helperText={
                  touched.nombre && typeof errors.nombre === "string"
                    ? errors.nombre
                    : ""
                }
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Apellido"
                variant="filled"
                name="apellido"
                value={values.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.apellido && !!errors.apellido}
                helperText={
                  touched.apellido && typeof errors.apellido === "string"
                    ? errors.apellido
                    : ""
                }
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                label="Correo"
                variant="filled"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.email && !!errors.email}
                helperText={
                  touched.email && typeof errors.email === "string"
                    ? errors.email
                    : ""
                }
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                label="Teléfono"
                variant="filled"
                name="telefono"
                value={values.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.telefono && !!errors.telefono}
                helperText={
                  touched.telefono && typeof errors.telefono === "string"
                    ? errors.telefono
                    : ""
                }
                sx={{ gridColumn: "span 4" }}
              />

              {/* Campos de solo lectura - no editables por usuarios normales */}
              <TextField
                fullWidth
                label="Cargo"
                variant="filled"
                name="cargo"
                value={(values.cargo || "").toUpperCase()}
                disabled={!isAdmin}
                InputProps={{ readOnly: !isAdmin }}
                sx={{ gridColumn: "span 2" }}
                helperText={!isAdmin ? "Solo visible" : ""}
              />

              <TextField
                fullWidth
                label="Municipio"
                variant="filled"
                name="municipio"
                value={(values.municipio || "").toUpperCase()}
                disabled={!isAdmin}
                InputProps={{ readOnly: !isAdmin }}
                sx={{ gridColumn: "span 2" }}
                helperText={!isAdmin ? "Solo visible" : ""}
              />

              <TextField
                fullWidth
                label="Rol"
                variant="filled"
                name="rol"
                value={(values.rol || "").toUpperCase()}
                disabled
                InputProps={{ readOnly: true }}
                sx={{ gridColumn: "span 4" }}
                helperText="Solo visible"
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Guardar Cambios"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Notificación de éxito/error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const perfilSchema = yup.object().shape({
  nombre: yup.string().required("Requerido"),
  apellido: yup.string().required("Requerido"),
  email: yup.string().email("Correo inválido").required("Requerido"),
  telefono: yup.string(),
});
