import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../layout/Header";
import { useNavigate } from "react-router-dom";
import { useSNCRegisterForm } from "../../hooks/useRegisterSNCForm";
import { usePerfil } from "../../hooks/usePerfilForm";
import { useSnackbar } from "../../hooks/useSnackbar";

const NotasCreditoForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const { showSuccess, showError, SnackbarComponent } = useSnackbar();

  const { user } = usePerfil();
  const { form, loading, updateField, handleSubmit } = useSNCRegisterForm();

  if (!user) return null;

  const onSubmit = async () => {
    const ok = await handleSubmit();

    if (ok) {
      showSuccess("Ticket creado correctamente");

      setTimeout(() => navigate("/dashboard/tickets/Notas-C"), 500);
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
        <Header title="CREAR TICKET" subtitle="Nuevo Tickets Notas Crédito" />
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

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
        <Box
          sx={{
            gridColumn: "span 6",
            backgroundColor: colors.primary[400],
            p: "20px",
            borderRadius: "10px",
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Nombre"
              name="nombres"
              fullWidth
              value={user.nombres}
            />

            <TextField
              label="Apellidos"
              name="apellidos"
              fullWidth
              value={user.apellidos}
            />

            <TextField
              type="date"
              name="fecha_facturacion"
              label="Fecha de Facturación"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={form.fecha_facturacion}
              onChange={(e) => updateField("fecha_facturacion", e.target.value)}
            />

            <TextField
              label="Factura para Anular"
              name="factura_anular"
              fullWidth
              value={form.factura_anular}
              onChange={(e) => updateField("factura_anular", e.target.value)}
            />

            <TextField
              label="Factura Copago para Anular"
              name="factura_copago_anular"
              fullWidth
              value={form.factura_copago_anular}
              onChange={(e) =>
                updateField("factura_copago_anular", e.target.value)
              }
            />
          </Box>
        </Box>
        <Box
          sx={{
            gridColumn: "span 6",
            backgroundColor: colors.primary[400],
            p: "20px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" color={colors.grey[100]} mb={2}>
            Información
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Valor Copago Anulado"
              name="valor_copago_anulado"
              fullWidth
              value={form.valor_copago_anulado}
              onChange={(e) =>
                updateField("valor_copago_anulado", e.target.value)
              }
            />
            <TextField
              label="Factura Anulada que se Refactura"
              name="factura_refacturar"
              fullWidth
              value={form.factura_refacturar}
              onChange={(e) =>
                updateField("factura_refacturar", e.target.value)
              }
            />
            <TextField
              label="Centro de Atención"
              fullWidth
              value={user.municipio}
              disabled
            />

            <TextField
              label="Nombre del Facturador"
              fullWidth
              value={`${user.nombres} ${user.apellidos}`}
              disabled
            />

            <TextField
              label="Motivo"
              name="motivo"
              fullWidth
              multiline
              minRows={3}
              value={form.motivo}
              onChange={(e) => updateField("motivo", e.target.value)}
            />
            <Button variant="contained" onClick={onSubmit} disabled={loading}>
              Crear Ticket Notas Crédito
            </Button>
          </Box>
        </Box>
      </Box>
      {SnackbarComponent}
    </Box>
  );
};

export default NotasCreditoForm;
