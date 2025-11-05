import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import '../../styles/components/Modal.css';

//Componente Modal reutilizable
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  centered = true,
  backdrop = true,
  keyboard = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  showCloseButton = true,
  closeButtonText = 'Cerrar',
  ...props
}) => {
  // Maneja evento de tecla de Escape para cerrar el modal
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (keyboard && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, keyboard, onClose]);

  // Maneja evento de clic en el backdrop para cerrar el modal
  const handleBackdropClick = (e) => {
    if (backdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalClasses = [
    'modal-custom',
    `modal-custom--${size}`,
    centered ? 'modal-custom--centered' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-custom-backdrop"
        onClick={handleBackdropClick}
        {...props}
      >
        <div className={modalClasses}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className={`modal-custom__header ${headerClassName}`}>
              {title && (
                <h4 className="modal-custom__title">{title}</h4>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="modal-custom__close"
                  onClick={onClose}
                  aria-label="Cerrar modal"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={`modal-custom__body ${bodyClassName}`}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`modal-custom__footer ${footerClassName}`}>
              {typeof footer === 'boolean' ? (
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  {closeButtonText}
                </Button>
              ) : (
                footer
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xl']),
  centered: PropTypes.bool,
  backdrop: PropTypes.bool,
  keyboard: PropTypes.bool,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
  closeButtonText: PropTypes.string
};

export default Modal;