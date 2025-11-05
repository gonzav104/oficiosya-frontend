import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/LegalPages.css';

function TerminosUso() {
  return (
    <div className="legal-page-container">
      <div className="container">
        <div className="legal-header">
          <Link to="/" className="back-home-link">
            <i className="bi bi-arrow-left me-2"></i>
            Volver al inicio
          </Link>
          <h1 className="legal-title">Términos de Uso</h1>
          <p className="legal-subtitle">
            Última actualización: Noviembre 2025
          </p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder y usar OficiosYA, aceptas estar sujeto a estos Términos de Uso 
              y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con 
              alguno de estos términos, no debes usar nuestra plataforma.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Descripción del Servicio</h2>
            <p>
              OficiosYA es una plataforma digital que conecta a personas que necesitan 
              servicios de oficios con prestadores calificados. Facilitamos la conexión 
              entre usuarios, pero no somos parte directa de las transacciones entre 
              prestadores y clientes.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Registro y Cuentas de Usuario</h2>
            <h3>3.1 Elegibilidad</h3>
            <p>
              Debes tener al menos 18 años para usar OficiosYA. Al registrarte, 
              confirmas que toda la información proporcionada es veraz y exacta.
            </p>
            
            <h3>3.2 Responsabilidad de la Cuenta</h3>
            <ul>
              <li>Eres responsable de mantener la confidencialidad de tu contraseña</li>
              <li>Debes notificar inmediatamente cualquier uso no autorizado de tu cuenta</li>
              <li>No puedes transferir tu cuenta a otra persona</li>
              <li>Solo puedes tener una cuenta activa</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Uso Aceptable</h2>
            <h3>4.1 Conducta Permitida</h3>
            <ul>
              <li>Proporcionar información veraz en tu perfil</li>
              <li>Comunicarte de manera respetuosa con otros usuarios</li>
              <li>Cumplir con todos los acuerdos realizados a través de la plataforma</li>
              <li>Respetar los derechos de propiedad intelectual</li>
            </ul>

            <h3>4.2 Conducta Prohibida</h3>
            <p>Está estrictamente prohibido:</p>
            <ul>
              <li>Proporcionar información falsa o engañosa</li>
              <li>Acosar, amenazar o discriminar a otros usuarios</li>
              <li>Usar la plataforma para actividades ilegales</li>
              <li>Intentar acceder sin autorización a cuentas de otros usuarios</li>
              <li>Enviar spam o contenido no solicitado</li>
              <li>Usar bots o automatizar interacciones</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Prestadores de Servicios</h2>
            <h3>5.1 Obligaciones</h3>
            <ul>
              <li>Poseer las licencias y certificaciones necesarias para ofrecer tus servicios</li>
              <li>Proporcionar servicios de calidad según lo acordado</li>
              <li>Mantener un comportamiento profesional</li>
              <li>Cumplir con todas las leyes locales aplicables</li>
            </ul>

            <h3>5.2 Presupuestos y Servicios</h3>
            <ul>
              <li>Los presupuestos enviados constituyen una oferta vinculante</li>
              <li>Debes cumplir con los plazos y especificaciones acordadas</li>
              <li>Eres responsable de la calidad del trabajo realizado</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Clientes</h2>
            <h3>6.1 Solicitudes de Servicio</h3>
            <ul>
              <li>Proporciona descripciones claras y precisas de los servicios necesarios</li>
              <li>Facilita acceso al lugar de trabajo cuando sea necesario</li>
              <li>Realiza los pagos según lo acordado</li>
            </ul>

            <h3>6.2 Evaluación de Prestadores</h3>
            <ul>
              <li>Evalúa de manera justa y honesta los servicios recibidos</li>
              <li>Proporciona feedback constructivo</li>
              <li>No uses las calificaciones como forma de coacción</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Tarifas y Pagos</h2>
            <p>
              OficiosYA puede cobrar tarifas por el uso de la plataforma. Todas las 
              tarifas se comunicarán claramente antes de su aplicación. Los pagos 
              entre prestadores y clientes son responsabilidad de ambas partes.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Propiedad Intelectual</h2>
            <p>
              OficiosYA y todo su contenido (incluyendo textos, gráficos, logos, 
              imágenes, software) son propiedad de OficiosYA o sus licenciantes y 
              están protegidos por las leyes de propiedad intelectual.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Limitación de Responsabilidad</h2>
            <p>
              OficiosYA actúa como intermediario y no es responsable por:
            </p>
            <ul>
              <li>La calidad de los servicios prestados</li>
              <li>Disputas entre usuarios</li>
              <li>Daños o perjuicios resultantes del uso de la plataforma</li>
              <li>Pérdida de datos o interrupciones del servicio</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>10. Suspensión y Terminación</h2>
            <p>
              OficiosYA se reserva el derecho de suspender o terminar cuentas que 
              violen estos términos. Los usuarios pueden cancelar su cuenta en 
              cualquier momento a través de la configuración de su perfil.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Modificaciones</h2>
            <p>
              OficiosYA puede modificar estos términos en cualquier momento. 
              Las modificaciones significativas se notificarán a los usuarios 
              y entrarán en vigencia 30 días después de su publicación.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República Argentina. 
              Cualquier disputa será resuelta en los tribunales competentes 
              de la provincia de Buenos Aires.
            </p>
          </div>

          <div className="legal-section">
            <h2>13. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos Términos de Uso, puedes contactarnos:
            </p>
            <ul>
              <li>Email: legal@oficiosya.com</li>
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

export default TerminosUso;