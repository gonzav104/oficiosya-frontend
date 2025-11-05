import React from 'react';
import PropTypes from 'prop-types';

//Componente reutilizable para mostrar alertas y notificaciones
const AlertMessage = ({ 
  type = 'info', 
  message, 
  title,
  onClose, 
  dismissible = true,
  icon = true,
  className = '',
  children,
  ...props 
}) => {
  // Si no hay mensaje y no hay children, no renderizar nada
  if (!message && !children) {
    return null;
  }

  // Configuración de iconos por tipo
  const iconMap = {
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-triangle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
    primary: 'bi-info-circle-fill',
    secondary: 'bi-info-circle-fill',
    light: 'bi-info-circle-fill',
    dark: 'bi-info-circle-fill'
  };

  // Normalizar tipo de alerta
  const normalizedType = type === 'error' ? 'danger' : type;
  
  // Clases CSS
  const alertClasses = [
    'alert',
    `alert-${normalizedType}`,
    dismissible ? 'alert-dismissible' : '',
    'fade',
    'show',
    className
  ].filter(Boolean).join(' ');

  // Icono correspondiente
  const iconClass = icon ? iconMap[normalizedType] || iconMap.info : null;

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="d-flex align-items-start">
        {/* Icono */}
        {iconClass && (
          <i className={`bi ${iconClass} me-2 flex-shrink-0`} style={{ marginTop: '2px' }}></i>
        )}
        
        <div className="flex-grow-1">
          {/* Título */}
          {title && (
            <h6 className="alert-heading mb-1">{title}</h6>
          )}
          
          {/* Mensaje principal */}
          {message && (
            <div className="mb-0">
              {typeof message === 'string' && message.includes('\n') ? (
                // Si el mensaje tiene saltos de línea, se procesan adecuadamente
                message.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < message.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))
              ) : (
                message
              )}
            </div>
          )}
          
          {/* Contenido adicional */}
          {children}
        </div>

        {/* Botón de cierre */}
        {dismissible && (
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Cerrar"
          ></button>
        )}
      </div>
    </div>
  );
};

AlertMessage.propTypes = {
  type: PropTypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'error', 
    'warning', 'info', 'light', 'dark'
  ]),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string,
  onClose: PropTypes.func,
  dismissible: PropTypes.bool,
  icon: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default AlertMessage;