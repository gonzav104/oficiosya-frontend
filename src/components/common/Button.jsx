import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/Button.css';

// Componente Button reutilizable
const Button = ({ 
  children, 
  as: Component = 'button',
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  loadingText,
  fullWidth = false,
  ...props 
}) => {
  const baseClass = 'btn-custom';
  const variantClass = `btn-custom--${variant}`;
  const sizeClass = `btn-custom--${size}`;
  const disabledClass = (disabled || loading) ? 'btn-custom--disabled' : '';
  const fullWidthClass = fullWidth ? 'btn-custom--full-width' : '';
  
  const finalClassName = [
    baseClass, 
    variantClass, 
    sizeClass, 
    disabledClass, 
    fullWidthClass, 
    className
  ].filter(Boolean).join(' ');
  
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const buttonProps = Component === 'button' ? { 
    type, 
    disabled: disabled || loading 
  } : {};
  
  return (
    <Component
      className={finalClassName}
      onClick={handleClick}
      {...buttonProps}
      {...props}
    >
      {loading && (
        <span className="btn-custom__spinner"></span>
      )}
      {icon && !loading && (
        <i className={`bi bi-${icon} btn-custom__icon`}></i>
      )}
      <span className={loading ? 'btn-custom__text--loading' : ''}>
        {loading ? (loadingText || 'Cargando...') : children}
      </span>
    </Component>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.elementType,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'outline-primary', 'outline-secondary']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.string,
  fullWidth: PropTypes.bool
};

export default Button;