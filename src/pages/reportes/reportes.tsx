import {
  Box,
  useTheme,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "../../Components/layout/Header";
import { tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getHistoricoReportes,
  getReporteTickets,
  HistoricoReporte,
  TicketReporte,
} from "../../services/reportes/reportesApi";
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { getTicketEstado } from "../../services/tickets/tickectsApi";
import { normalizeEstados } from "../../data/ticketsNormalizer";

const MESES_ES: Record<string, string> = {
  January: "Enero",
  February: "Febrero",
  March: "Marzo",
  April: "Abril",
  May: "Mayo",
  June: "Junio",
  July: "Julio",
  August: "Agosto",
  September: "Septiembre",
  October: "Octubre",
  November: "Noviembre",
  December: "Diciembre",
};

const Reportes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);

  const [historico, setHistorico] = useState<HistoricoReporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const canViewReports = user?.rol === "ingeniero" || user?.rol === "admin";

  const [estadoTotales, setEstadoTotales] = useState({
    abierto: 0,
    en_proceso: 0,
    resuelto: 0,
    totalGeneral: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const estadoRaw = await getTicketEstado();
        const data = await getHistoricoReportes();
        setEstadoTotales(normalizeEstados(estadoRaw));
        setHistorico(data);
      } catch (error) {
        console.error("Error al cargar historico:", error);
      } finally {
        setLoading(false);
      }
    };

    if (canViewReports) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [canViewReports]);

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
    link.download = `${filename}.csv`;
    link.click();
  };

  const handleDownloadMes = async (
    anio: number,
    mes: number,
    nombreMes: string
  ) => {
    const key = `${anio}-${mes}`;
    setDownloading(key);

    try {
      const primerDia = new Date(anio, mes - 1, 1);
      const ultimoDia = new Date(anio, mes, 0);

      const fechaInicio = primerDia.toISOString().split("T")[0];
      const fechaFin = ultimoDia.toISOString().split("T")[0];

      const data = await getReporteTickets({
        periodo: "rango",
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });

      const mesEs = MESES_ES[nombreMes] || nombreMes;
      exportToCSV(data, `reporte_${mesEs}_${anio}`);
    } catch (error) {
      console.error("Error al descargar reporte:", error);
    } finally {
      setDownloading(null);
    }
  };

  const columns: GridColDef<HistoricoReporte>[] = [
    {
      field: "periodo",
      headerName: "Periodo",
      flex: 1,
      renderCell: ({ row }) => {
        const mesEs = MESES_ES[row.nombre_mes] || row.nombre_mes;
        return (
          <Typography fontWeight="bold">
            {mesEs} {row.anio}
          </Typography>
        );
      },
    },
    {
      field: "total_tickets",
      headerName: "Total Tickets",
      flex: 0.7,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color="primary"
          size="small"
          icon={<AssessmentIcon />}
        />
      ),
    },
    {
      field: "abiertos",
      headerName: "Abiertos",
      flex: 0.6,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          sx={{ backgroundColor: "#f59e0b", color: "#fff" }}
        />
      ),
    },
    {
      field: "en_proceso",
      headerName: "En Proceso",
      flex: 0.6,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          sx={{ backgroundColor: "#3b82f6", color: "#fff" }}
          icon={<PendingIcon sx={{ color: "#fff !important" }} />}
        />
      ),
    },
    {
      field: "resueltos",
      headerName: "Resueltos",
      flex: 0.6,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          sx={{ backgroundColor: "#10b981", color: "#fff" }}
          icon={<CheckCircleIcon sx={{ color: "#fff !important" }} />}
        />
      ),
    },
    {
      field: "rfast",
      headerName: "R-FAST",
      flex: 0.5,
    },
    {
      field: "notas_credito",
      headerName: "Notas Credito",
      flex: 0.7,
    },
    {
      field: "otros_soportes",
      headerName: "Otros",
      flex: 0.5,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.8,
      renderCell: ({ row }) => {
        const key = `${row.anio}-${row.mes}`;
        const isDownloading = downloading === key;

        return (
          <Button
            size="small"
            variant="contained"
            onClick={() => handleDownloadMes(row.anio, row.mes, row.nombre_mes)}
            disabled={isDownloading}
            sx={{
              width: 100,
              backgroundColor: colors.blueAccent[700],
              "&:hover": { backgroundColor: colors.blueAccent[600] },
            }}
          >
            {isDownloading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DownloadIcon fontSize="small" />
            )}
          </Button>
        );
      },
    },
  ];

  const totales = historico.reduce(
    (acc, item) => ({
      total: acc.total + item.total_tickets,
      abiertos: acc.abiertos + item.abiertos,
      en_proceso: acc.en_proceso + item.en_proceso,
      resueltos: acc.resueltos + item.resueltos,
    }),
    { total: 0, abiertos: 0, en_proceso: 0, resueltos: 0 }
  );

  if (!canViewReports) {
    return (
      <Box m="20px">
        <Header title="Reportes" subtitle="Historial de reportes mensuales" />
        <Typography color="error" mt={4}>
          No tiene permisos para ver esta seccion.
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="Reportes" subtitle="Historial de reportes mensuales" />

      {/* Tarjetas de resumen */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
        mb={3}
      >
        <Box gridColumn="span 3">
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AssessmentIcon
                  sx={{ color: colors.blueAccent[500], fontSize: 40 }}
                />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {totales.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tickets
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box gridColumn="span 3">
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon sx={{ color: "#f59e0b", fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {estadoTotales.abierto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Abiertos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box gridColumn="span 3">
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <PendingIcon sx={{ color: "#3b82f6", fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {estadoTotales.en_proceso}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    En Proceso
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box gridColumn="span 3">
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <CheckCircleIcon sx={{ color: "#10b981", fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {estadoTotales.resuelto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resueltos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Tabla de historico */}
      <Box
        height="60vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
        }}
      >
        <DataGrid
          rows={historico}
          columns={columns}
          loading={loading}
          getRowId={(row) => `${row.anio}-${row.mes}`}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Reportes;
