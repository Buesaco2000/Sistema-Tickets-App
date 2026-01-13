import { Box, Typography, useTheme } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { tokens } from "../../theme";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FactCheckIcon from "@mui/icons-material/FactCheck";

interface WidgetProps {
  type: "r-fast" | "notasC" | "otrosS";
  value: number;
  diff?: number;
  onOpen: (type: "r-fast" | "notasC" | "otrosS") => void;
  onOpenI: (type: "r-fast" | "notasC" | "otrosS") => void;
}

const Widget = ({ type, value, diff = 0, onOpen, onOpenI }: WidgetProps) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let data: {
    title: string;
    isValor: boolean;
    link: string;
    icon: JSX.Element;
    bgColor: string;
  };

  switch (type) {
    case "r-fast":
      data = {
        title: "TICKETS R-FAST",
        isValor: true,
        link: "Ver todos los tickets",
        icon: (
          <MiscellaneousServicesIcon
            sx={{
              fontSize: 26,
              color: colors.redAccent[500],
            }}
          />
        ),
        bgColor: "rgba(255, 0, 0, 0.2)",
      };
      break;

    case "notasC":
      data = {
        title: "TICKECTS NOTAS CREDITOS",
        isValor: true,
        link: "Ver todos los tickects",
        icon: (
          <MonetizationOnIcon
            sx={{
              fontSize: 26,
              color: colors.greenAccent[500],
            }}
          />
        ),
        bgColor: "rgba(218,165,32,0.2)",
      };
      break;

    case "otrosS":
      data = {
        title: "OTROS SOPORTES",
        isValor: true,
        link: "Ver todos los tickects",
        icon: (
          <FactCheckIcon
            sx={{
              fontSize: 26,
              color: colors.greenAccent[500],
            }}
          />
        ),
        bgColor: "rgba(0,128,0,0.2)",
      };
      break;

    default:
      throw new Error("Invalid Widget type");
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flex: 1,
        padding: "18px",
        borderRadius: "10px",
        height: "150px",
        backgroundColor: colors.primary[400],
        boxShadow: 3,
      }}
    >
      {/* LEFT */}
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <Typography variant="body2" color={colors.grey[300]} fontWeight="bold">
          {data.title}
        </Typography>

        <Typography variant="h4" fontWeight="bold">
          {data.isValor && "#"} {value}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            width: "max-content",
            borderBottom: "1px solid gray",
            cursor: "pointer",
          }}
          onClick={() => onOpenI(type)}
        >
          {data.link}
        </Typography>
      </Box>

      {/* RIGHT */}
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <Box
          display="flex"
          alignItems="center"
          sx={{ color: diff >= 0 ? "green" : "red" }}
        >
          <KeyboardArrowUpIcon />
          <Typography variant="body2">{diff}%</Typography>
        </Box>

        <Box
          sx={{
            alignSelf: "flex-end",
            padding: "6px",
            borderRadius: "5px",
            backgroundColor: data.bgColor,
            cursor: "pointer",
          }}
          onClick={() => onOpen(type)}
        >
          {data.icon}
        </Box>
      </Box>
    </Box>
  );
};

export default Widget;
