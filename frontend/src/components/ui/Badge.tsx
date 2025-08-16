import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-cyan-100 text-cyan-800',
  light: 'bg-gray-50 text-gray-600',
  dark: 'bg-gray-700 text-white'
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1'
};

export default function Badge({
  variant = 'primary',
  size = 'md',
  rounded = true,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export { Badge };