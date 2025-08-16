import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = '', 
  size = 'md', 
  className = '', 
  children 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full bg-gray-100 ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-gray-600 font-medium">
          {children || alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};
