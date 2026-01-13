import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import {
  Popover,
  Grow,
  Typography,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { getAvatarLetter } from "../../data/avatar";

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user, logout } = useContext(AuthContext);

  const [anchorNotifications, setAnchorNotifications] =
    useState<null | HTMLElement>(null);

  const [anchorProfile, setAnchorProfile] = useState<null | HTMLElement>(null);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        sx={{
          display: "flex",
          backgroundColor: `${colors.primary[400]}`,
          borderRadius: "3px",
        }}
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={(e) => setAnchorNotifications(e.currentTarget)}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={(e) => setAnchorProfile(e.currentTarget)}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      <Popover
        open={Boolean(anchorProfile)}
        anchorEl={anchorProfile}
        onClose={() => setAnchorProfile(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={Grow}
        PaperProps={{
          sx: {
            width: 280,
            p: 2,
            borderRadius: 2,
            backgroundColor: colors.primary[400],
            color: "text.primary",
          },
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              mr: 2,
              bgcolor: colors.blueAccent[600],
              color: colors.grey[100],
              fontWeight: "bold",
            }}
          >
            {getAvatarLetter(user?.nombres, user?.email)}
          </Avatar>

          <Box>
            <Typography variant="subtitle1">
              {user?.nombres} {user?.apellidos}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.cargo?.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box mt={1}>
          <Button
            fullWidth
            sx={{
              justifyContent: "flex-start",
              color: "text.primary",
            }}
          >
            Correo: {user?.email}
          </Button>

          <Button
            fullWidth
            sx={{
              justifyContent: "flex-start",
              color: "text.primary",
            }}
          >
            Municipio: {user?.municipio}
          </Button>

          <Button
            fullWidth
            sx={{
              justifyContent: "flex-start",
              color: "text.primary",
            }}
          >
            Telefono: {user?.telefono}
          </Button>

          <Button
            fullWidth
            sx={{
              justifyContent: "flex-start",
              color: "text.primary",
            }}
          >
            Estado: {user?.activo ? "Activo" : "Inactivo"}
          </Button>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => {
            setAnchorProfile(null);
            logout();
          }}
        >
          Cerrar Sesión
        </Button>
      </Popover>

      <Popover
        open={Boolean(anchorNotifications)}
        anchorEl={anchorNotifications}
        onClose={() => setAnchorNotifications(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={Grow}
        PaperProps={{
          sx: {
            width: 320,
            p: 2,
            borderRadius: 2,
            backgroundColor: colors.primary[400],
            color: "text.primary",
          },
        }}
      >
        <Typography variant="subtitle1" mb={1}>
          Notifications
        </Typography>

        <Divider />

        <Box mt={1}>
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.primary">
                Roman joined the Team!
              </Typography>
              <Typography variant="caption" color="text.primary">
                Congratulate him
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <Avatar sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body2" color="text.primary">
                New message received
              </Typography>
              <Typography variant="caption" color="text.primary">
                Salma sent you a message
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Button variant="contained" fullWidth>
          Ver Mas
        </Button>
      </Popover>
    </Box>
  );
};

export default Navbar;
