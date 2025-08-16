import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, placement = 'top' }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={`absolute z-10 hidden whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:block group-hover:opacity-100 transition-opacity duration-200
          ${placement === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
          ${placement === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
          ${placement === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
          ${placement === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}`}
      >
        {content}
      </div>
    </div>
  );
}