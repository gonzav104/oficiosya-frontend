import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './common';
import logo from '../assets/logo_nombre.png';
import '../styles/components/Navbar.css';

function Navbar() {
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
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* === CONTENIDO COLAPSABLE === */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="ms-auto">
            {/* === BOTONES CON NUEVOS ESTILOS === */}
            <ul className="navbar-nav align-items-center">
              <li className="nav-item me-2 mb-2 mb-lg-0">
                <Button 
                  as={Link} 
                  to="/login"
                  variant="secondary" 
                  size="medium"
                  icon="box-arrow-in-right"
                  className="w-100"
                >
                  Iniciar Sesión
                </Button>
              </li>
              <li className="nav-item">
                <Button 
                  as={Link} 
                  to="/registro"
                  variant="primary" 
                  size="medium"
                  icon="person-plus-fill"
                  className="w-100"
                >
                  Registrarse
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


