import { GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SoportePlataforma } from "../types/soportePlataforma";
import { EstadoTicket } from "../types/tickets";

// Colores según el estado
const getEstadoColor = (estado: EstadoTicket) => {
  switch (estado) {
    case "abierto":
      return "#f59e0b"; // Amarillo/Naranja
    case "en_proceso":
      return "#3b82f6"; // Azul
    case "resuelto":
      return "#10b981"; // Verde
    default:
      return "#6b7280"; // Gris
  }
};

// Icono según el estado
const getEstadoIcon = (estado: EstadoTicket) => {
  switch (estado) {
    case "abierto":
      return <PendingOutlinedIcon fontSize="small" />;
    case "en_proceso":
      return <HourglassBottomIcon fontSize="small" />;
    case "resuelto":
      return <CheckCircleOutlinedIcon fontSize="small" />;
    default:
      return null;
  }
};

export const getTicketsColumnsSP = (
  onEstadoChange?: (id: number, estado: EstadoTicket) => void,
  canChangeEstado: boolean = false,
  onVerTicket?: (ticket: SoportePlataforma) => void
): GridColDef<SoportePlataforma>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) =>
      params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
  },

  {
    field: "imagen_url",
    headerName: "Imagen",
    flex: 1,
    renderCell: ({ value }) =>
      value ? (
        <Box display="flex" alignItems="center">
          <img
            src={value}
            alt="ticket"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </Box>
      ) : (
        "_"
      ),
  },

  {
    field: "name",
    headerName: "Ingeniero",
    flex: 1,
    valueGetter: (_, row) => `${row.nombresIng} ${row.apellidosIng}`,
    cellClassName: "name-column--cell",
  },

  {
    field: "tipo_error",
    headerName: "Tipo de Error",
    flex: 1,
  },

  {
    field: "created_at",
    headerName: "Fecha",
    flex: 1,
  },

  {
    field: "estado",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => {
      const estado = row.estado as EstadoTicket;
      const bgColor = getEstadoColor(estado);

      // Si NO puede cambiar estado O ya está resuelto → mostrar solo badge
      if (!canChangeEstado || estado === "resuelto") {
        return (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              px: 1,
              py: 0.5,
              backgroundColor: bgColor,
              color: "#fff",
              borderRadius: "4px",
              fontWeight: 600,
              minHeight: "32px",
              lineHeight: "1.5",
            }}
          >
            {getEstadoIcon(estado)}
            {estado}
          </Box>
        );
      }

      // Si PUEDE cambiar estado → mostrar selector
      return (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            px: 1,
            py: 0.5,
            backgroundColor: bgColor,
            borderRadius: "4px",
          }}
        >
          {getEstadoIcon(estado)}
          <select
            value={estado}
            onChange={(e) =>
              onEstadoChange?.(row.id, e.target.value as EstadoTicket)
            }
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: 600,
              backgroundColor: bgColor,
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            <option value="abierto">Abierto</option>
            <option value="en_proceso">En Proceso</option>
            <option value="resuelto">Resuelto</option>
          </select>
        </Box>
      );
    },
  },
  {
    field: "acciones",
    headerName: "Acciones",
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => (
      <Tooltip title="Ver detalles">
        <IconButton
          onClick={() => onVerTicket?.(row)}
          sx={{ color: "#3b82f6" }}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    ),
  },
];
