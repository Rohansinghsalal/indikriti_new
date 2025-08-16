import React from 'react';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({ 
  className = '',
  orientation = 'horizontal',
}) => {
  const baseClasses = 'bg-gray-200';
  const orientationClasses = orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px';
  
  return (
    <div className={`${baseClasses} ${orientationClasses} ${className}`} />
  );
};

export default Separator;