import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Componente de input de contraseña con botón mostrar/ocultar
const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  className = '',
  helpText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Generar ID único si no se proporciona
  const inputId = props.id || `password-${name}`;

  // Toggle mostrar/ocultar contraseña
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Clases CSS para el input
  const inputClasses = [
    'form-control',
    error ? 'is-invalid' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`mb-3 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      {/* Input con botón toggle */}
      <div className="input-group">
        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-describedby={helpText ? `${inputId}-help` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={toggleShowPassword}
          title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          disabled={disabled}
          tabIndex={-1} // No incluir en tab navigation
        >
          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </button>
      </div>

      {/* Texto de ayuda */}
      {helpText && (
        <div id={`${inputId}-help`} className="form-text">
          {helpText}
        </div>
      )}

      {/* Error de validación */}
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
};

PasswordInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  helpText: PropTypes.string,
  id: PropTypes.string
};

export default PasswordInput;