import {
  Box,
  useTheme,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../Components/layout/Header";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import { tokens } from "../../theme";
import { getTicketsColumns } from "../../data/ticketsColumns";
import { useContext, useEffect, useState } from "react";
import { EstadoTicket, Soporte } from "../../types/tickets";
import {
  getTickets,
  updateTicketEstado,
} from "../../services/tickets/tickectsApi";
import { AuthContext } from "../../context/AuthContext";
import {
  getReporteTickets,
  PeriodoReporte,
  TicketReporte,
  TipoSoporteReporte,
} from "../../services/reportes/reportesApi";

const Tickets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);

  const [rows, setRows] = useState<Soporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Estado para el diálogo de selección de tipo de soporte
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState<PeriodoReporte>("semana");
  const [selectedTipoSoporte, setSelectedTipoSoporte] = useState<TipoSoporteReporte>("todos");

  // Estado para el diálogo de ver detalles del ticket
  const [verDialogOpen, setVerDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Soporte | null>(null);

  const canChangeEstado = user?.rol === "ingeniero" || user?.rol === "admin";
  const canDownloadReports = user?.rol === "ingeniero" || user?.rol === "admin";

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await getTickets({ signal: controller.signal });

        if (isMounted) {
          setRows(data);
          setLoading(false);
        }
      } catch (error) {
        // Ignorar errores de cancelación (AbortError nativo o CanceledError de Axios)
        const isCanceled =
          error instanceof Error &&
          (error.name === "AbortError" || error.name === "CanceledError");
        if (!isCanceled) {
          console.error(error);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleEstadoChange = async (id: number, nuevoEstado: EstadoTicket) => {
    try {
      await updateTicketEstado(id, nuevoEstado);
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

  const exportToCSV = (data: TicketReporte[], filename: string) => {
    const headers = [
      "ID",
      "Fecha",
      "Estado",
      "Tipo Soporte",
      "Usuario",
      "Email Usuario",
      "Telefono",
      "Ingeniero",
      "Municipio",
      "Descripcion",
    ];

    const csvRows = data.map((ticket) => [
      ticket.id,
      new Date(ticket.fecha_creacion).toLocaleDateString("es-CO"),
      ticket.estado,
      ticket.tipo_soporte,
      `${ticket.usuario_nombres} ${ticket.usuario_apellidos}`,
      ticket.usuario_email,
      ticket.usuario_telefono,
      `${ticket.ingeniero_nombres || ""} ${
        ticket.ingeniero_apellidos || ""
      }`.trim() || "No asignado",
      ticket.municipio,
      (ticket.descripcion || "").replace(/"/g, '""'),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Abre el diálogo para seleccionar tipo de soporte
  const handleOpenDialog = (periodo: PeriodoReporte) => {
    setAnchorEl(null);
    setSelectedPeriodo(periodo);
    setSelectedTipoSoporte("todos"); // Resetear a "todos" cada vez
    setDialogOpen(true);
  };

  // Cierra el diálogo sin descargar
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Ejecuta la descarga con el periodo y tipo seleccionados
  const handleConfirmDownload = async () => {
    setDialogOpen(false);
    setDownloading(true);

    try {
      const data = await getReporteTickets({
        periodo: selectedPeriodo,
        tipo_soporte_id: selectedTipoSoporte,
      });

      if (data.length === 0) {
        setSnackbar({
          open: true,
          message: "No hay tickets para los filtros seleccionados",
          severity: "error",
        });
        return;
      }

      const periodoLabel: Record<PeriodoReporte, string> = {
        semana: "ultima_semana",
        mes: "mes_actual",
        anio: "anio_actual",
        rango: "rango",
        todos: "todos",
      };

      const tipoLabel: Record<TipoSoporteReporte, string> = {
        todos: "todos",
        "1": "otros_soportes",
        "2": "rfast",
        "3": "notas_credito",
      };

      exportToCSV(
        data,
        `reporte_tickets_${periodoLabel[selectedPeriodo]}_${tipoLabel[selectedTipoSoporte]}`
      );
      setSnackbar({
        open: true,
        message: `Reporte descargado: ${data.length} tickets`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error al descargar reporte:", error);
      setSnackbar({
        open: true,
        message: "Error al descargar el reporte",
        severity: "error",
      });
    } finally {
      setDownloading(false);
    }
  };

  // Función para abrir el diálogo de ver detalles
  const handleVerTicket = (ticket: Soporte) => {
    setSelectedTicket(ticket);
    setVerDialogOpen(true);
  };

  const columns = getTicketsColumns(handleEstadoChange, canChangeEstado, handleVerTicket);

  return (
    <Box m="20px">
      <Box
        mt="25px"
        p="0 20px 0 20px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Header title="Tickets" subtitle="Gestion de los Tickets" />

        {canDownloadReports && (
          <>
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              disabled={downloading}
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "10px",
                fontWeight: "bold",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: colors.blueAccent[600],
                },
              }}
            >
              <DownloadIcon sx={{ mr: "5px" }} />
              {downloading ? "Descargando..." : "Descargar Reportes"}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  backgroundColor: colors.primary[400],
                },
              }}
            >
              <MenuItem onClick={() => handleOpenDialog("semana")}>
                <ListItemIcon>
                  <TodayIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Ultima Semana</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleOpenDialog("mes")}>
                <ListItemIcon>
                  <DateRangeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Mes Actual</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleOpenDialog("anio")}>
                <ListItemIcon>
                  <CalendarMonthIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Anio Actual</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleOpenDialog("todos")}>
                <ListItemIcon>
                  <EventIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Todos los Tickets</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
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
        <DataGrid<Soporte>
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Diálogo para seleccionar tipo de soporte antes de descargar */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[400],
            minWidth: "350px",
          },
        }}
      >
        <DialogTitle>Seleccionar Tipo de Ticket</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="tipo-soporte-label">Tipo de Soporte</InputLabel>
            <Select
              labelId="tipo-soporte-label"
              value={selectedTipoSoporte}
              label="Tipo de Soporte"
              onChange={(e: SelectChangeEvent) =>
                setSelectedTipoSoporte(e.target.value as TipoSoporteReporte)
              }
            >
              <MenuItem value="todos">Todos los Tipos</MenuItem>
              <MenuItem value="2">R-FAST</MenuItem>
              <MenuItem value="3">Notas de Crédito</MenuItem>
              <MenuItem value="1">Otros Soportes</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDownload}
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700],
              "&:hover": { backgroundColor: colors.blueAccent[600] },
            }}
          >
            Descargar
          </Button>
        </DialogActions>
      </Dialog>

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
              Detalles del Ticket #{selectedTicket?.id}
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
                  Usuario
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.nombres} {selectedTicket.apellidos}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                  Email
                </Typography>
                <Typography variant="body1">{selectedTicket.email}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                  Tipo de Soporte
                </Typography>
                <Typography variant="body1">{selectedTicket.tipo}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color={colors.grey[400]}>
                  Descripción del Problema
                </Typography>
                <Typography variant="body1">
                  {selectedTicket.tipo_error || "Sin descripción"}
                </Typography>
              </Box>

              {selectedTicket.imagen_url && (
                <Box>
                  <Typography variant="subtitle2" color={colors.grey[400]} mb={1}>
                    Imagen Adjunta
                  </Typography>
                  <Box
                    component="img"
                    src={selectedTicket.imagen_url}
                    alt="Imagen del ticket"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
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

export default Tickets;
