import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/solid';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  type?: AlertVariant; // alias for legacy support
  title?: string;
  message?: string; // ✅ added message support
  children?: React.ReactNode; // ✅ made optional
  dismissible?: boolean;
  onDismiss?: () => void;
  onClose?: () => void; // alias for legacy support
  className?: string;
}

const variantClasses: Record<AlertVariant, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-400',
    icon: <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-400',
    icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-400',
    icon: <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-400',
    icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
  }
};

export function Alert({
  variant,
  type,
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  onClose,
  className = '',
}: AlertProps) {
  const resolvedVariant: AlertVariant = variant || type || 'info';
  const { bg, text, border, icon } = variantClasses[resolvedVariant];
  const handleDismiss = onDismiss || onClose;

  return (
    <div className={`rounded-md p-4 ${bg} border-l-4 ${border} ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          {title && <h3 className={`text-sm font-medium ${text}`}>{title}</h3>}
          {(children || message) && (
            <div className={`text-sm ${text} ${title ? 'mt-2' : ''}`}>
              {children || message}
            </div>
          )}
        </div>
        {dismissible && handleDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={handleDismiss}
                className={`inline-flex rounded-md p-1.5 ${text} hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${resolvedVariant}-50 focus:ring-${resolvedVariant}-600`}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
