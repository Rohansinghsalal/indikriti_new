import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  footer,
  className = '',
  noPadding = false,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Card Header */}
      {(title || action) && (
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={`${noPadding ? '' : 'p-6'}`}>{children}</div>

      {/* Card Footer */}
      {footer && (
        <div className="border-t px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

export const CardTitle = ({ className = '', ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
);

export const CardContent = ({ className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

export default Card;
