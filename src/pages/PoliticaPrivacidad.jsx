import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/LegalPages.css';

function PoliticaPrivacidad() {
  return (
    <div className="legal-page-container">
      <div className="container">
        <div className="legal-header">
          <Link to="/" className="back-home-link">
            <i className="bi bi-arrow-left me-2"></i>
            Volver al inicio
          </Link>
          <h1 className="legal-title">Política de Privacidad</h1>
          <p className="legal-subtitle">
            Última actualización: Noviembre 2025
          </p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Información que Recopilamos</h2>
            <p>
              En OficiosYA, recopilamos información que nos proporcionas directamente cuando:
            </p>
            <ul>
              <li>Te registras en nuestra plataforma</li>
              <li>Completas tu perfil como prestador de servicios o cliente</li>
              <li>Publicas solicitudes de servicios o envías presupuestos</li>
              <li>Nos contactas a través de nuestros canales de soporte</li>
            </ul>
            <p>
              Esta información puede incluir: nombre completo, dirección de correo electrónico, 
              número de teléfono, ubicación, información de servicios ofrecidos, y cualquier 
              otra información que decidas compartir en tu perfil.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Cómo Utilizamos tu Información</h2>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li>Facilitar la conexión entre prestadores de servicios y clientes</li>
              <li>Verificar la identidad de los usuarios y mantener la seguridad de la plataforma</li>
              <li>Procesar transacciones y facilitar la comunicación entre usuarios</li>
              <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
              <li>Enviar notificaciones importantes sobre tu cuenta o la plataforma</li>
              <li>Cumplir con obligaciones legales y reglamentarias</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Compartir Información</h2>
            <p>
              No vendemos, intercambiamos o transferimos tu información personal a terceros 
              sin tu consentimiento, excepto en los siguientes casos:
            </p>
            <ul>
              <li>
                <strong>Entre usuarios:</strong> Compartimos información necesaria para facilitar 
                la conexión entre prestadores y clientes (nombre, calificaciones, ubicación general).
              </li>
              <li>
                <strong>Proveedores de servicios:</strong> Con terceros que nos ayudan a operar 
                la plataforma (hosting, procesamiento de pagos, análisis).
              </li>
              <li>
                <strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o para 
                proteger los derechos y seguridad de nuestros usuarios.
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Seguridad de la Información</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para 
              proteger tu información personal contra acceso no autorizado, alteración, 
              divulgación o destrucción. Esto incluye:
            </p>
            <ul>
              <li>Encriptación de datos sensibles</li>
              <li>Acceso restringido a información personal</li>
              <li>Monitoreo regular de nuestros sistemas</li>
              <li>Capacitación de nuestro equipo en privacidad y seguridad</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Tus Derechos</h2>
            <p>Como usuario de OficiosYA, tienes derecho a:</p>
            <ul>
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta o incompleta</li>
              <li>Solicitar la eliminación de tu cuenta y datos</li>
              <li>Restringir el procesamiento de tu información</li>
              <li>Recibir una copia de tus datos en formato portable</li>
              <li>Retirar tu consentimiento en cualquier momento</li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctanos a través de nuestro formulario 
              de contacto o enviando un email a privacidad@oficiosya.com
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia 
              en la plataforma, recordar tus preferencias, y analizar el uso del sitio. 
              Puedes controlar las cookies a través de la configuración de tu navegador.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos 
              sobre cambios significativos publicando la nueva política en esta página y 
              actualizando la fecha de "última actualización". Te recomendamos revisar 
              esta política periódicamente.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta Política de Privacidad o nuestras prácticas 
              de privacidad, puedes contactarnos:
            </p>
            <ul>
              <li>Email: privacidad@oficiosya.com</li>
              <li>Teléfono: +54 11 1234-5678</li>
              <li>Dirección: Universidad Nacional de San Antonio de Areco (UNSADA)</li>
            </ul>
          </div>

          <div className="legal-footer">
            <p>
              <strong>OficiosYA</strong> - Desarrollado por estudiantes de Analistas en Sistemas<br/>
              Universidad Nacional de San Antonio de Areco (UNSADA)<br/>
              Grupo 3: Gonzalo Velázquez, Camila Kapp, Iván Rodríguez, Federico Ramírez
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoliticaPrivacidad;