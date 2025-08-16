import React, { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ 
  children, 
  htmlFor, 
  className = '',
  ...props 
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
