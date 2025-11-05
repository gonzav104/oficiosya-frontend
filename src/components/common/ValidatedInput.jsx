import React from 'react';
import PropTypes from 'prop-types';

//Componente de input reutilizable con validación integrada
const ValidatedInput = ({
  label,
  name,
  type = 'text',
  as,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  readOnly = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  helpText,
  icon,
  maxLength,
  min,
  max,
  step,
  accept,
  multiple = false,
  rows = 3,
  options = [],
  ...props
}) => {
  // Determinar el tipo de input real
  const inputType = as || type;
  // Generar ID único si no se proporciona
  const inputId = props.id || `input-${name}`;

  // Clases CSS para el input
  const inputClasses = [
    'form-control',
    error ? 'is-invalid' : '',
    inputClassName
  ].filter(Boolean).join(' ');

  // Clases CSS para el label
  const labelClasses = [
    'form-label',
    labelClassName
  ].filter(Boolean).join(' ');

  // Renderizar el input según el tipo
  const renderInput = () => {
    const commonProps = {
      id: inputId,
      name,
      value: type === 'file' ? undefined : value,
      onChange,
      onBlur,
      className: inputType === 'textarea' ? inputClasses.replace('form-control', 'form-control') : inputClasses,
      placeholder,
      disabled,
      readOnly,
      required,
      maxLength,
      min,
      max,
      step,
      accept,
      multiple,
      'aria-describedby': helpText ? `${inputId}-help` : undefined,
      'aria-invalid': error ? 'true' : 'false',
      ...props
    };

    switch (inputType) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option, index) => (
              <option 
                key={option.value || option || index} 
                value={option.value || option}
                disabled={option.disabled}
              >
                {option.label || option.text || option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="form-check">
            <input
              {...commonProps}
              type="checkbox"
              className="form-check-input"
              checked={value || false}
            />
            <label className="form-check-label" htmlFor={inputId}>
              {label}
              {required && <span className="text-danger ms-1">*</span>}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div>
            {options.map((option, index) => (
              <div key={option.value || option || index} className="form-check">
                <input
                  {...commonProps}
                  type="radio"
                  id={`${inputId}-${index}`}
                  className="form-check-input"
                  value={option.value || option}
                  checked={value === (option.value || option)}
                />
                <label 
                  className="form-check-label" 
                  htmlFor={`${inputId}-${index}`}
                >
                  {option.label || option.text || option}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return <input {...commonProps} type={inputType} />;
    }
  };

  // No mostrar label para checkbox ya que se maneja internamente
  const showLabel = inputType !== 'checkbox' && label;
  const showInputGroup = icon;

  return (
    <div className={`mb-3 ${className}`}>
      {/* Label */}
      {showLabel && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      {/* Input con icono opcional */}
      {showInputGroup ? (
        <div className="input-group">
          {icon && icon.position === 'left' && (
            <span className="input-group-text">
              <i className={`bi ${icon.name}`}></i>
            </span>
          )}
          {renderInput()}
          {icon && icon.position === 'right' && (
            <span className="input-group-text">
              <i className={`bi ${icon.name}`}></i>
            </span>
          )}
        </div>
      ) : (
        renderInput()
      )}

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

ValidatedInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'text', 'email', 'password', 'number', 'tel', 'url', 'search',
    'date', 'time', 'datetime-local', 'month', 'week',
    'file', 'hidden', 'range', 'color',
    'textarea', 'select', 'checkbox', 'radio'
  ]),
  as: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array
  ]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  helpText: PropTypes.string,
  icon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['left', 'right'])
  }),
  maxLength: PropTypes.number,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  rows: PropTypes.number,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
        text: PropTypes.string,
        disabled: PropTypes.bool
      })
    ])
  )
};

export default ValidatedInput;