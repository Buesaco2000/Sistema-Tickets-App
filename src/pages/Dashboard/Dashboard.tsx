import Navbar from "../../Components/layout/Navbar";
import { ColorModeContext, useMode } from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Siderbar from "../../Components/layout/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Index";
import CalendarPage from "../calendar/calendar";
import FAQ from "../faq";
import FormPerfilPage from "../form/perfil";
import TicketForm from "../../Components/forms/ticketsForm";
import NotasCreditoForm from "../../Components/forms/NotasCreditoForm";
import OtrosSoportesForm from "../../Components/forms/OtrosSoportesForm";
import TicketsNotasCredito from "../tickets/ticketsNotasCredito";
import TicketsRfast from "../tickets/ticketsRfast";
import Tickets from "../tickets/tickets";
import TicketsOSoporte from "../tickets/ticketsSoporteOtros";
import TicketsUsuarios from "../usuarios/ticketsUsuarios";
import FormUsuarioPage from "../usuarios/usuarios";
import Reportes from "../reportes/reportes";

function DashboardPage() {
  const { theme, colorMode } = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Siderbar />
          <main className="content">
            <Navbar />
            <Routes>
              <Route index element={<Dashboard />} />

              <Route path="tickets" element={<Tickets />} />
              
              <Route path="tickets/R-FAST" element={<TicketsRfast />} />
              <Route path="tickets/R-FAST/crearNuevo" element={<TicketForm />} />

              <Route path="tickets/Notas-C" element={<TicketsNotasCredito />} />
                <Route path="tickets/Notas_Creditos/crearNuevo" element={<NotasCreditoForm />} />

              <Route path="tickets/Soportes-O" element={<TicketsOSoporte />} />
                <Route path="tickets/Otros_Soportes/crearNuevo" element={<OtrosSoportesForm />} />

              <Route path="perfil" element={<FormPerfilPage />} />

              <Route path="usuarios" element={<TicketsUsuarios />} />
              <Route path="usuarios/crearNuevo" element={<FormUsuarioPage />} />

              <Route path="reportes" element={<Reportes />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="faq" element={<FAQ />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default DashboardPage;
