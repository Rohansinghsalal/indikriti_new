import React from 'react';

export type LoaderSize = 'sm' | 'md' | 'lg';
export type LoaderVariant = 'primary' | 'secondary' | 'white';

export interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  fullScreen?: boolean;
  label?: string;
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

const variantClasses: Record<LoaderVariant, string> = {
  primary: 'border-blue-600 border-t-transparent',
  secondary: 'border-gray-600 border-t-transparent',
  white: 'border-white border-t-transparent'
};

export default function Loader({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  label,
  className = '',
}: LoaderProps) {
  const loader = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${variantClasses[variant]}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {label && <p className="mt-2 text-sm text-gray-600">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {loader}
      </div>
    );
  }

  return loader;
} 