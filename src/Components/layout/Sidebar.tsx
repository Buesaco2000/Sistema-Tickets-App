import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useContext, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { AuthContext } from "../../context/AuthContext";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { getAvatarLetter } from "../../data/avatar";

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (value: string) => void;
}

const Item = ({ title, to, icon, selected, setSelected }: ItemProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

export const Siderbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { user } = useContext(AuthContext);

  const isIngeniero = user?.rol === "ingeniero" || user?.rol === "admin";
  const isSalud = user?.rol === "salud" || user?.rol === "admin";
  const isAdmin = user?.rol === "admin";

  return (
    <Box
      sx={{
        "& .ps-sidebar-container": {
          height: "140vh",
          background: `${colors.primary[400]} !important`,
        },
        "& .ps-menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .ps-menu-button": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .ps-menu-button:hover": {
          color: "#868dfb !important",
        },
        "& .ps-active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
              backgroundColor: "transparent",
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USUARIO */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mr: 2,
                    bgcolor: colors.blueAccent[600],
                    color: colors.grey[100],
                    fontWeight: "bold",
                    fontSize: "3.5rem",
                    cursor: "pointer",
                  }}
                >
                  {getAvatarLetter(user?.nombres, user?.email)}
                </Avatar>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.nombres} {user?.apellidos}
                </Typography>
                <Typography
                  variant="h5"
                  color={colors.greenAccent[500]}
                  sx={{ textTransform: "uppercase" }}
                >
                  {user?.cargo}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Dashboard
            </Typography>

            <Item
              title="Dashboard"
              to="/dashboard/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {isSalud && (
              <>
                <Item
                  title="R-FAST"
                  to="/dashboard/tickets/R-FAST"
                  icon={<MiscellaneousServicesIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Notas_Creditos"
                  to="/dashboard/tickets/Notas-C"
                  icon={<MonetizationOnIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="Otros_Soportes"
                  to="/dashboard/tickets/Soportes-O"
                  icon={<FactCheckIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {isIngeniero && (
              <>
                <Item
                  title="Tickets"
                  to="/dashboard/tickets"
                  icon={<MiscellaneousServicesIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Reportes"
                  to="/dashboard/reportes"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            <Item
              title="Perfil"
              to="/dashboard/perfil"
              icon={<BadgeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {isAdmin && (
              <>
                <Item
                  title="Usuarios"
                  to="/dashboard/usuarios"
                  icon={<GroupOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            <Item
              title="Calendario"
              to="/dashboard/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="FAQ Page"
              to="/dashboard/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default Siderbar;
