import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { tokens } from "../../theme";
import Header from "../../Components/layout/Header";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import StatBox from "../../Components/layout/StackBox";
import { DataGrid } from "@mui/x-data-grid";
import Widget from "../../Components/layout/widget";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getTotalesTicket,
  getTicketEstado,
  getTickets,
  getTicketsEstado,
  updateTicketEstado,
} from "../../services/tickets/tickectsApi";
import { getTicketsColumns } from "../../data/ticketsColumns";
import {
  normalizeEstados,
  normalizeTotalesPorSoporte,
} from "../../data/ticketsNormalizer";
import { EstadoTicket, Soporte } from "../../types/tickets";
import {
  getReporteTickets,
  PeriodoReporte,
  TicketReporte,
  TipoSoporteReporte,
} from "../../services/reportes/reportesApi";
import { useSnackbar } from "../../hooks/useSnackbar";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isSalud = user?.rol === "salud" || user?.rol === "admin";

  const [rows, setRows] = useState<Soporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [downloading, setDownloading] = useState(false);
  const { showSuccess, showError, SnackbarComponent } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] =
    useState<PeriodoReporte>("semana");
  const [selectedTipoSoporte, setSelectedTipoSoporte] =
    useState<TipoSoporteReporte>("todos");

  const canChangeEstado = user?.rol === "ingeniero" || user?.rol === "admin";
  const canDownloadReports = user?.rol === "ingeniero" || user?.rol === "admin";

  const [totalesSoporte, setTotalesSoporte] = useState({
    rFast: 0,
    notasCredito: 0,
    otros: 0,
  });

  const [estadoTotales, setEstadoTotales] = useState({
    abierto: 0,
    en_proceso: 0,
    resuelto: 0,
    totalGeneral: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [listado, soporteRaw, estadoRaw] = await Promise.all([
          getTickets(),
          getTotalesTicket(),
          getTicketEstado(),
        ]);
        getTicketsEstado(), setRows(listado);
        setTotalesSoporte(normalizeTotalesPorSoporte(soporteRaw));
        setEstadoTotales(normalizeEstados(estadoRaw));
      } catch (error) {
        console.error("Error cargando tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const porcentajes = useMemo(() => {
    const total =
      totalesSoporte.rFast + totalesSoporte.notasCredito + totalesSoporte.otros;

    return {
      rFast: total ? Math.round((totalesSoporte.rFast / total) * 100) : 0,
      notasCredito: total
        ? Math.round((totalesSoporte.notasCredito / total) * 100)
        : 0,
      otros: total ? Math.round((totalesSoporte.otros / total) * 100) : 0,
    };
  }, [totalesSoporte]);

  const handleEstadoChange = useCallback(
    async (id: number, estado: EstadoTicket) => {
      try {
        await updateTicketEstado(id, estado);
        setRows((prev) =>
          prev.map((row) => (row.id === id ? { ...row, estado } : row))
        );
      } catch (error) {
        console.error("Error actualizando estado", error);
      }
    },
    []
  );

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
        showError("No hay tickets para los filtros seleccionados");
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
      showSuccess(`Reporte descargado: ${data.length} tickets`);
    } catch (error) {
      showError("Error al descargar el reporte");
    } finally {
      setDownloading(false);
    }
  };

  const columns = useMemo(
    () => getTicketsColumns(handleEstadoChange, canChangeEstado),
    [handleEstadoChange, canChangeEstado]
  );

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Bienvenido a tu dashboard" />

        {canChangeEstado && (
          <>
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
          </>
        )}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          sx={{
            gridColumn: "span 4",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title={estadoTotales.abierto}
            subtitle="Tickets Pendientes"
            progress={
              estadoTotales.totalGeneral
                ? estadoTotales.abierto / estadoTotales.totalGeneral
                : 0
            }
            increase={`+${
              estadoTotales.totalGeneral
                ? Math.round(
                    (estadoTotales.abierto / estadoTotales.totalGeneral) * 100
                  )
                : 0
            }%`}
            icon={
              <HourglassEmptyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          sx={{
            gridColumn: "span 4",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title={estadoTotales.en_proceso || 0}
            subtitle="Tickets En Proceso"
            progress={
              estadoTotales.totalGeneral
                ? estadoTotales.en_proceso / estadoTotales.totalGeneral
                : 0
            }
            increase={`+${
              estadoTotales.totalGeneral
                ? Math.round(
                    (estadoTotales.en_proceso / estadoTotales.totalGeneral) *
                      100
                  )
                : 0
            }%`}
            icon={
              <CheckCircleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          sx={{
            gridColumn: "span 4",
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title={estadoTotales.resuelto || 0}
            subtitle="Tickets Resueltos"
            progress={
              estadoTotales.totalGeneral
                ? estadoTotales.resuelto / estadoTotales.totalGeneral
                : 0
            }
            increase={`+${
              estadoTotales.totalGeneral
                ? Math.round(
                    (estadoTotales.resuelto / estadoTotales.totalGeneral) * 100
                  )
                : 0
            }%`}
            icon={
              <CheckCircleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        {isSalud && (
          <>
            <Box
              gridColumn="span 4"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Widget
                type="r-fast"
                value={totalesSoporte.rFast}
                diff={porcentajes.rFast}
                onOpen={() => navigate("tickets/R-FAST/crearNuevo")}
                onOpenI={() => navigate("tickets/R-FAST")}
              />
            </Box>

            <Box
              gridColumn="span 4"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Widget
                type="notasC"
                value={totalesSoporte.notasCredito}
                diff={porcentajes.notasCredito}
                onOpen={() => navigate("tickets/Notas_Creditos/crearNuevo")}
                onOpenI={() => navigate("tickets/Notas-C")}
              />
            </Box>

            <Box
              gridColumn="span 4"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Widget
                type="otrosS"
                value={totalesSoporte.otros}
                diff={porcentajes.otros}
                onOpen={() => navigate("tickets/Otros_Soportes/crearNuevo")}
                onOpenI={() => navigate("tickets/Soportes-O")}
              />
            </Box>
          </>
        )}

        {/* ROW 3 */}
        <Box
          sx={{
            gridColumn: "span 12",
            gridRow: "span 3",
            backgroundColor: colors.primary[400],
          }}
        >
          <Box
            mt="25px"
            p="0 20px 0 20px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight={600} color={colors.grey[100]}>
              Mis Tickets
            </Typography>
          </Box>

          <Box m="20px">
            <Box
              m="10px 0 0 0"
              height="52vh"
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

            {SnackbarComponent}

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
                  <InputLabel id="tipo-soporte-label">
                    Tipo de Soporte
                  </InputLabel>
                  <Select
                    labelId="tipo-soporte-label"
                    value={selectedTipoSoporte}
                    label="Tipo de Soporte"
                    onChange={(e: SelectChangeEvent) =>
                      setSelectedTipoSoporte(
                        e.target.value as TipoSoporteReporte
                      )
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
