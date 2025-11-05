import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import ConditionalNavbar from './components/ConditionalNavbar';
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
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import TerminosUso from "./pages/TerminosUso";

function AppContent() {
  const location = useLocation();

  // Páginas de ancho completo
  const fullWidthPages = ['/', '/login', '/registro', '/recuperar-contrasena', '/politica-privacidad', '/terminos-uso'];
  const isFullWidth = fullWidthPages.includes(location.pathname);

  return (
    <>
      <ConditionalNavbar />
      <div className={isFullWidth ? '' : 'container mt-4 mb-5'}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos-uso" element={<TerminosUso />} />
          
          {/* Rutas protegidas para solicitantes */}
          <Route 
            path="/panel-solicitante" 
            element={
              <ProtectedRoute requiredRole="Cliente">
                <PanelSolicitante />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/solicitud/:id" 
            element={
              <ProtectedRoute>
                <SolicitudDetalle />
              </ProtectedRoute>
            } 
          />
          <Route path="/perfil/:id" element={<PerfilPrestador />} />
          <Route 
            path="/solicitud/:solicitudId/prestador/:prestadorId/solicitar-presupuesto" 
            element={
              <ProtectedRoute requiredRole="Cliente">
                <SolicitarPresupuesto />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas protegidas para prestadores */}
          <Route 
            path="/panel-prestador" 
            element={
              <ProtectedRoute requiredRole="Prestador">
                <PanelPrestador />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editar-perfil-prestador" 
            element={
              <ProtectedRoute requiredRole="Prestador">
                <EditarPerfilPrestador />
              </ProtectedRoute>
            } 
          />
          
           {/* Rutas de administración */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="Administrador">
                <PanelAdmin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
