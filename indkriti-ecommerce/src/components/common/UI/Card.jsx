import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  elevation = 'medium',
  className = '',
  onClick,
  ...props
}) => {
  const variantClasses = {
    default: 'card-default',
    outlined: 'card-outlined',
    flat: 'card-flat'
  };

  const elevationClasses = {
    none: 'elevation-0',
    low: 'elevation-1',
    medium: 'elevation-2',
    high: 'elevation-3'
  };

  const cardClasses = [
    'card',
    variantClasses[variant],
    elevationClasses[elevation],
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}
      
      <div className="card-content">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;