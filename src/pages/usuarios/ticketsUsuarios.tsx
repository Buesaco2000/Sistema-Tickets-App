import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../Components/layout/Header";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getTicketsColumnsUsuario } from "../../data/tickectsColumnsUsuario";
import { EstadoUser, User } from "../../types/User";
import {
  getUsuariosApi,
  updateUsuarioEstado,
} from "../../services/auth/authApi";
import { useNavigate } from "react-router-dom";

const TicketsUsuarios = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getUsuariosApi();
      setRows(data);
      setLoading(false);
    };

    load();
  }, []);

  const handleEstadoChange = async (id: number, nuevoEstado: EstadoUser) => {
    try {
      await updateUsuarioEstado(id, nuevoEstado);
      // Actualizar el estado local
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, activo: nuevoEstado } : row
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("No se pudo cambiar el estado del ticket");
    }
  };

  const columns = getTicketsColumnsUsuario(handleEstadoChange);

  return (
    <Box m="20px">
      <Box
        mt="25px"
        p="0 20px 0 20px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Header title="Usuarios" subtitle="Gestión de los Usuarios" />

        <>
          <Button
            onClick={() => navigate(`/dashboard/usuarios/crearNuevo`)}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "10px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <AddCircleOutlineIcon sx={{ mr: "5px" }} />
            Nuevo Usuario
          </Button>
        </>
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
        <DataGrid<User>
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default TicketsUsuarios;
