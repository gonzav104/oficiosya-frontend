import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './common';
import logo from '../assets/logo_nombre.png';
import '../styles/components/Navbar.css';

function NavbarAuth() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estado para las notificaciones
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  // Simulación de notificaciones
  // Cargar notificaciones desde el backend
  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/notificaciones', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!res.ok) throw new Error('Error al obtener notificaciones');

        const json = await res.json();
        const items = (json.data || []).map(n => ({
          id: n.id_notificacion || n.id,
          titulo: n.titulo,
          mensaje: n.mensaje,
          tipo: n.tipo || 'general',
          leida: (n.estado || '').toLowerCase() === 'leida',
          fecha: n.fecha_envio ? new Date(n.fecha_envio) : new Date()
        }));

        setNotificaciones(items);
      } catch (err) {
        console.error('No se pudieron cargar las notificaciones:', err);
      }
    };

    fetchNotificaciones();
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mostrarDropdown) {
        const dropdownElement = event.target.closest('.nav-item');
        if (!dropdownElement || !dropdownElement.contains(event.target)) {
          setMostrarDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mostrarDropdown]);

  // Función para determinar la ruta del panel según el rol del usuario
  const getPanelRoute = () => {
    if (!user || !user.rol) return '/';
    
    switch (user.rol) {
      case 'Cliente':
      case 'Solicitante':
        return '/panel-solicitante';
      case 'Prestador':
        return '/panel-prestador';
      case 'Administrador':
      case 'Admin':
        return '/admin';
      default:
        return '/';
    }
  };

  // Funciones para manejar notificaciones
  const toggleNotificaciones = () => {
    const next = !mostrarDropdown;
    setMostrarDropdown(next);
    // Si abrimos el dropdown, refrescamos las notificaciones
    if (next) {
      (async () => {
        try {
          const res = await fetch('http://localhost:3000/api/notificaciones', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          if (!res.ok) throw new Error('Error al obtener notificaciones');
          const json = await res.json();
          const items = (json.data || []).map(n => ({
            id: n.id_notificacion || n.id,
            titulo: n.titulo,
            mensaje: n.mensaje,
            tipo: n.tipo || 'general',
            leida: (n.estado || '').toLowerCase() === 'leida',
            fecha: n.fecha_envio ? new Date(n.fecha_envio) : new Date()
          }));
          setNotificaciones(items);
        } catch (err) {
          console.error('No se pudieron cargar las notificaciones:', err);
        }
      })();
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/notificaciones/${id}/marcar-leida`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Error marcando notificación como leída');

      // Actualizar estado local
      setNotificaciones(notifs => 
        notifs.map(notif => notif.id === id ? { ...notif, leida: true } : notif)
      );
    } catch (err) {
      console.error('No se pudo marcar la notificación como leída:', err);
    }
  };

  const formatearTiempo = (fecha) => {
    const ahora = new Date();
    const diferencia = ahora - fecha;
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas}h`;
    return `Hace ${dias}d`;
  };

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar navegación incluso si hay error
      navigate('/', { replace: true });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm custom-navbar">
      <div className="container-fluid">
        {/* === LOGO === */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo de OficiosYA" className="navbar-logo" />
        </Link>

        {/* === BOTÓN RESPONSIVE === */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarAuthContent"
          aria-controls="navbarAuthContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* === CONTENIDO COLAPSABLE === */}
        <div className="collapse navbar-collapse" id="navbarAuthContent">
          <div className="ms-auto d-flex align-items-center">
            {/* === INFO USUARIO === */}
            <span className="navbar-text me-3 d-none d-lg-block">
              Hola, <strong>{user?.nombre_completo || user?.correo}</strong>
            </span>

            {/* === NAVEGACIÓN === */}
            <ul className="navbar-nav align-items-center">
              {/* === MI PANEL === */}
              <li className="nav-item me-2">
                <Button 
                  as={Link}
                  to={getPanelRoute()} 
                  variant="primary"
                  size="medium"
                  icon="speedometer2"
                >
                  <span className="d-none d-sm-inline">Mi Panel</span>
                </Button>
              </li>

              {/* === NOTIFICACIONES === */}
              <li className="nav-item me-3 position-relative">
                <button 
                  className={`btn btn-navbar-icon position-relative ${notificacionesNoLeidas > 0 ? 'has-notifications' : ''}`}
                  type="button"
                  onClick={toggleNotificaciones}
                  aria-label="Notificaciones"
                >
                  <i className="bi bi-bell-fill"></i>
                  {notificacionesNoLeidas > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notificacionesNoLeidas}
                    </span>
                  )}
                </button>

                {/* Dropdown de notificaciones */}
                {mostrarDropdown && (
                  <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{
                    top: '100%',
                    right: 0,
                    minWidth: '320px',
                    maxWidth: '400px',
                    zIndex: 1050
                  }}>
                    <div className="dropdown-header d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">Notificaciones</h6>
                      <small className="text-muted">{notificacionesNoLeidas} nuevas</small>
                    </div>
                    <div className="dropdown-divider"></div>
                    
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notificaciones.length > 0 ? (
                        notificaciones.map(notif => (
                          <div 
                            key={notif.id}
                            className={`dropdown-item-text p-3 border-bottom ${!notif.leida ? 'bg-light' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => marcarComoLeida(notif.id)}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <strong className="text-dark" style={{ fontSize: '0.9rem' }}>
                                {notif.titulo}
                              </strong>
                              <small className="text-muted ms-2">
                                {formatearTiempo(notif.fecha)}
                              </small>
                            </div>
                            <p className="mb-0 text-muted small">
                              {notif.mensaje}
                            </p>
                            {!notif.leida && (
                              <span className="badge bg-primary mt-1" style={{ fontSize: '0.7rem' }}>
                                Nueva
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="dropdown-item-text text-center py-4 text-muted">
                          <i className="bi bi-bell-slash fs-3 mb-2 d-block"></i>
                          No tienes notificaciones
                        </div>
                      )}
                    </div>
                  
                  </div>
                )}
              </li>

              {/* === CERRAR SESIÓN === */}
              <li className="nav-item">
                <Button 
                  variant="secondary"
                  size="medium"
                  icon="box-arrow-right"
                  onClick={handleLogout}
                >
                  <span className="d-none d-sm-inline">Cerrar Sesión</span>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAuth;