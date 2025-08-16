'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
}

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-700">
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(
            'peer h-5 w-5 shrink-0 rounded border border-gray-300 shadow-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
            <CheckIcon className="h-4 w-4" />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;
