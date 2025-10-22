import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_nombre.png'; // Asegúrate de que esta ruta sea correcta
import './Navbar.css'; // Asegúrate de tener este archivo CSS importado

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm custom-navbar">
      <div className="container-fluid">
        {/* === LOGO === */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo de OficiosYA" className="navbar-logo" />
        </Link>

        <div className="collapse navbar-collapse">
          <div className="ms-auto d-flex align-items-center">
            {/* === BOTONES CON NUEVOS ESTILOS === */}
            <ul className="navbar-nav align-items-center">
              <li className="nav-item me-2">
                <Link className="btn btn-navbar btn-navbar-secondary" to="/login">
                  <i className="bi bi-box-arrow-in-right"></i>
                  Iniciar Sesión
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-navbar btn-navbar-primary" to="/registro">
                  <i className="bi bi-person-plus-fill"></i>
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


