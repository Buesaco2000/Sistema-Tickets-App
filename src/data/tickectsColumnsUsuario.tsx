import { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { EstadoUser, User } from "../types/User";

const getEstadoColor = (activo: boolean) => {
  return activo ? "#10b981" : "#ef4444";
};

const getEstadoIcon = (activo: boolean) => {
  return activo ? (
    <CheckCircleOutlinedIcon fontSize="small" />
  ) : (
    <BlockOutlinedIcon fontSize="small" />
  );
};

export const getTicketsColumnsUsuario = (
  onEstadoChange?: (id: number, activo: boolean) => void
): GridColDef<User>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 40,
    renderCell: (params) =>
      params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
  },

  {
    field: "name",
    headerName: "Usuario",
    flex: 1,
    valueGetter: (_, row) => `${row.nombres} ${row.apellidos}`,
    cellClassName: "name-column--cell",
  },

  {
    field: "email",
    headerName: "Correo",
    flex: 1,
  },

  {
    field: "telefono",
    headerName: "Telefono",
    flex: 1,
  },

  {
    field: "cargo",
    headerName: "Cargo",
    flex: 1,
    valueGetter: (_, row) => row.cargo?.toUpperCase() ?? "—",
  },

  {
    field: "estado",
    headerName: "Estado",
    flex: 1,
    renderCell: ({ row }) => {
      const estado = row.activo as EstadoUser;
      const bgColor = getEstadoColor(estado);

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
            value={row.activo ? "1" : "0"}
            onChange={(e) => onEstadoChange?.(row.id, e.target.value === "1")}
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
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </Box>
      );
    },
  },
];
