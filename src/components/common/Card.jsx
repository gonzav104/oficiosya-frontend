import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/Card.css';

// Componente Card reutilizable
const Card = ({
  children,
  header,
  footer,
  title,
  subtitle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  shadow = true,
  bordered = true,
  ...props
}) => {
  const cardClasses = [
    'card-custom',
    shadow ? 'card-custom--shadow' : '',
    bordered ? 'card-custom--bordered' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {/* Header */}
      {(header || title || subtitle) && (
        <div className={`card-custom__header ${headerClassName}`}>
          {header || (
            <>
              {title && <h5 className="card-custom__title">{title}</h5>}
              {subtitle && <p className="card-custom__subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}

      {/* Body */}
      <div className={`card-custom__body ${bodyClassName}`}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`card-custom__footer ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  footer: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  shadow: PropTypes.bool,
  bordered: PropTypes.bool
};

export default Card;