import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
// Componentes y Páginas
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import RecuperarContrasena from './pages/RecuperarContrasena';
import PanelSolicitante from './pages/PanelSolicitante';
import SolicitudDetalle from './pages/SolicitudDetalle';
import PerfilPrestador from "./pages/PerfilPrestador";
import SolicitarPresupuesto from "./pages/SolicitarPresupuesto";
import PanelPrestador from './pages/PanelPrestador';
import EditarPerfilPrestador from "./pages/EditarPerfilPrestador";
import PanelAdmin from "./pages/PanelAdmin";

// Utilidades
import RutaProtegidaPrestador from "./utils/RutaProtegidaPrestador";

function AppContent() {
  const [perfilCompleto, setPerfilCompleto] = useState(false);
  const location = useLocation();
  const handleProfileComplete = () => setPerfilCompleto(true);

  // Páginas de ancho completo
  const fullWidthPages = ['/', '/login', '/registro', '/recuperar-contrasena'];
  const isFullWidth = fullWidthPages.includes(location.pathname);

  return (
    <>
      <Navbar />
      <div className={isFullWidth ? '' : 'container mt-4 mb-5'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          
          <Route path="/panel-solicitante" element={<PanelSolicitante />} />
          <Route path="/solicitud/:id" element={<SolicitudDetalle />} />
          <Route path="/perfil/:id" element={<PerfilPrestador />} />
          <Route path="/solicitud/:solicitudId/prestador/:prestadorId/solicitar-presupuesto" element={<SolicitarPresupuesto />} />
          
          <Route 
            path="/editar-perfil" 
            element={<EditarPerfilPrestador onProfileComplete={handleProfileComplete} />} 
          />
          <Route 
            path="/panel-prestador" 
            element={
              <RutaProtegidaPrestador perfilCompleto={perfilCompleto}>
                <PanelPrestador />
              </RutaProtegidaPrestador>
            } 
          />
          
          <Route path="/admin" element={<PanelAdmin />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

