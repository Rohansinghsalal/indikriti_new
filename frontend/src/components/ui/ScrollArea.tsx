import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
  maxHeight?: string | number;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ 
  children, 
  className = '',
  viewportClassName = '',
  maxHeight,
}) => {
  const style = maxHeight ? { maxHeight } : {};
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        className={`h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${viewportClassName}`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollArea;