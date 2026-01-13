import { Box, Button, Typography, TextField, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../layout/Header";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useTicketForm } from "../../hooks/useRegisterTicketsForm";
import { crearSoporteRequest } from "../../services/tickets/ticketService";

const TicketForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { showSuccess, showError, SnackbarComponent } = useSnackbar();

  const {
    descripcion,
    setDescripcion,
    preview,
    handleImageChange,
    handleSubmit,
    loading,
  } = useTicketForm({
    tipoSoporteId: 2,
    submitFn: crearSoporteRequest,
  });

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleImageChange(file);
  };

  const onSubmit = async () => {
    const ok = await handleSubmit();

    if (ok) {
      showSuccess("Ticket creado correctamente");

      setTimeout(() => navigate("/dashboard/tickets/R-FAST"), 500);
    } else {
      showError("Error al crear el ticket");
    }
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Header title="CREAR TICKET" subtitle="Nuevo Tickets R-FAST" />
        <Button
          onClick={() => navigate("/dashboard")}
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "12px",
            fontWeight: "bold",
            padding: "6px 16px",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: colors.blueAccent[600],
            },
          }}
        >
          Volver
        </Button>
      </Box>

      {/* GRID FORM */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        {/* COLUMNA IZQUIERDA – IMAGEN */}
        <Box
          sx={{
            gridColumn: "span 4",
            backgroundColor: colors.primary[400],
            p: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" color={colors.grey[100]} mb={2}>
            Soporte / Imagen
          </Typography>

          <Button
            fullWidth
            variant="contained"
            component="label"
            sx={{ mb: 2 }}
          >
            Seleccionar Imagen
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onImageChange}
            />
          </Button>
          {preview && (
            <Box
              component="img"
              src={preview}
              alt="preview"
              sx={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "8px",
                border: `2px solid ${colors.greenAccent[500]}`,
              }}
            />
          )}
        </Box>

        {/* COLUMNA DERECHA – FORMULARIO */}
        <Box
          sx={{
            gridColumn: "span 8",
            backgroundColor: colors.primary[400],
            p: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" color={colors.grey[100]} mb={2}>
            Información del Ticket
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Descripción"
              name="descripcion"
              multiline
              minRows={4}
              fullWidth
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={loading || !descripcion.trim()}
              sx={{ alignSelf: "flex-end" }}
            >
              Crear Ticket
            </Button>
          </Box>
        </Box>
      </Box>
      {SnackbarComponent}
    </Box>
  );
};

export default TicketForm;
