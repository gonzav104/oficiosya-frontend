import React from 'react';
import PropTypes from 'prop-types';

//Componente reutilizable para mostrar spinners de carga

const LoadingSpinner = ({ 
  size = 'md', 
  type = 'border',
  color = 'primary',
  text = '',
  center = false,
  inline = false,
  className = '',
  ...props 
}) => {
  // Configuración de tamaños
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border spinner-border-lg'
  };

  // Configuración de tipos
  const typeClasses = {
    border: 'spinner-border',
    grow: 'spinner-grow'
  };

  // Clases del spinner
  const spinnerClasses = [
    typeClasses[type] || typeClasses.border,
    size !== 'lg' ? sizeClasses[size] : '',
    `text-${color}`,
    className
  ].filter(Boolean).join(' ');

  // Clases del contenedor
  const containerClasses = [
    center && !inline ? 'd-flex justify-content-center align-items-center' : '',
    inline ? 'd-inline-flex align-items-center' : ''
  ].filter(Boolean).join(' ');

  const spinnerElement = (
    <>
      <div 
        className={spinnerClasses} 
        role="status" 
        aria-hidden="true"
        {...props}
      >
        <span className="visually-hidden">Cargando...</span>
      </div>
      {text && (
        <span className={inline ? 'ms-2' : 'mt-2 d-block text-center'}>
          {text}
        </span>
      )}
    </>
  );

  if (center || inline) {
    return (
      <div className={containerClasses}>
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['border', 'grow']),
  color: PropTypes.string,
  text: PropTypes.string,
  center: PropTypes.bool,
  inline: PropTypes.bool,
  className: PropTypes.string
};

export default LoadingSpinner;