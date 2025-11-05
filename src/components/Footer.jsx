import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_nombre.png';
import '../styles/components/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const teamMembers = [
    { name: 'Gonzalo Velázquez', role: 'Full Stack Developer' },
    { name: 'Camila Kapp', role: 'Full Stack Developer' },
    { name: 'Iván Rodríguez', role: 'Full Stack Developer' },
    { name: 'Federico Ramírez', role: 'Full Stack Designer' }
  ];

  return (
    <footer className="footer-container">
      {/* Decoración superior */}
      <div className="footer-decoration"></div>
      
      <div className="footer-content">
        <div className="container">
          <div className="row justify-content-center">
            {/* Columna Logo y Descripción */}
            <div className="col-lg-5 col-md-6 mb-4">
              <div className="footer-brand">
                <img src={logo} alt="OficiosYA" className="footer-logo mb-3" />
                <p className="footer-description">
                  Conectamos profesionales con quienes necesitan sus servicios. 
                  La plataforma más confiable para encontrar y ofrecer servicios de oficios.
                </p>
                <div className="footer-social">
                  <a 
                    href="https://facebook.com/oficiosya" 
                    className="social-link" 
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a 
                    href="https://instagram.com/oficiosya" 
                    className="social-link" 
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a 
                    href="https://twitter.com/oficiosya" 
                    className="social-link" 
                    aria-label="Twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a 
                    href="https://linkedin.com/company/oficiosya" 
                    className="social-link" 
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>



            {/* Columna Equipo */}
            <div className="col-lg-5 col-md-6 mb-4">
              <h5 className="footer-title">Nuestro Equipo - Grupo 3</h5>
              <div className="team-grid">
                {teamMembers.map((member, index) => (
                  <div key={index} className="team-member">
                    <div className="member-avatar">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="member-info">
                      <h6 className="member-name">{member.name}</h6>
                      <small className="member-role">{member.role}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Línea separadora */}
          <hr className="footer-divider" />

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="university-info">
                  <i className="bi bi-mortarboard-fill me-2"></i>
                  <strong>Universidad Nacional de San Antonio de Areco (UNSADA)</strong>
                </div>
                <p className="copyright mb-0">
                  © {currentYear} OficiosYA. Todos los derechos reservados.
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="footer-legal">
                  <Link to="/politica-privacidad">Política de Privacidad</Link>
                  <span className="mx-2">•</span>
                  <Link to="/terminos-uso">Términos de Uso</Link>
                  <span className="mx-2">•</span>
                  <a 
                    href="https://opensource.org/licenses/MIT" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Licencia MIT
                  </a>
                </div>
                <div className="license-info mt-2">
                  <small className="text-white">
                    <i className="bi bi-code-square me-1"></i>
                    Desarrollado con ❤️ por estudiantes de Analistas en Sistemas
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="footer-bottom-decoration">
        <div className="wave-animation"></div>
      </div>
    </footer>
  );
}

export default Footer;