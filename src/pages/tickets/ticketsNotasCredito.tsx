import {
  Box,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../Components/layout/Header";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTicketsColumnsNC } from "../../data/ticketsColumnsSNC";
import { NotasCredito } from "../../types/notasCredito";
import {
  getTicketsNC,
  updateTicketEstado,
} from "../../services/tickets/tickectsApi";
import { AuthContext } from "../../context/AuthContext";
import { EstadoTicket } from "../../types/tickets";

const TicketsNotasCredito = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);

  const [rows, setRows] = useState<NotasCredito[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estado para el diálogo de ver detalles
  const [verDialogOpen, setVerDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<NotasCredito | null>(null);

  const canChangeEstado = user?.rol === "ingeniero" || user?.rol === "admin";

  useEffect(() => {
    const load = async () => {
      const data = await getTicketsNC();
      setRows(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleEstadoChange = async (id: number, nuevoEstado: EstadoTicket) => {
    try {
      await updateTicketEstado(id, nuevoEstado);
      // Actualizar el estado local
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, estado: nuevoEstado } : row
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado del ticket");
    }
  };

  // Función para abrir el diálogo de ver detalles
  const handleVerTicket = (ticket: NotasCredito) => {
    setSelectedTicket(ticket);
    setVerDialogOpen(true);
  };

  const columns = getTicketsColumnsNC(handleEstadoChange, canChangeEstado, handleVerTicket);

  return (
    <Box m="20px">
      <Box
        mt="25px"
        p="0 20px 0 20px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Header
          title="Tickects"
          subtitle="Gestión de los Tickects Notas Credito"
        />
        <Button
          onClick={() =>
            navigate(`/dashboard/tickets/Notas_Creditos/crearNuevo`)
          }
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "10px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <AddCircleOutlineIcon sx={{ mr: "5px" }} />
          Nuevo Tickects
        </Button>
      </Box>
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid<NotasCredito>
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>

      {/* Diálogo para ver detalles del ticket */}
      <Dialog
        open={verDialogOpen}
        onClose={() => setVerDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Detalles Nota de Crédito #{selectedTicket?.id}
            </Typography>
            <Chip
              label={selectedTicket?.estado}
              sx={{
                backgroundColor:
                  selectedTicket?.estado === "resuelto"
                    ? "#10b981"
                    : selectedTicket?.estado === "en_proceso"
                    ? "#3b82f6"
                    : "#f59e0b",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {selectedTicket && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                  Ingeniero Asignado
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.nombresIng} {selectedTicket.apellidosIng}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                  Centro de Atención
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.centro_atencion || "No especificado"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                  Motivo
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.motivo || "Sin motivo"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                  Valor Copago Anulado
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.valor_copago_anulado || "N/A"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                  Tipo de Error
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.tipo_error || "Sin descripción"}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setVerDialogOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700],
              "&:hover": { backgroundColor: colors.blueAccent[600] },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketsNotasCredito;
