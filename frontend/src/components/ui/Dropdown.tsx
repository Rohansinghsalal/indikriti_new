import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export interface DropdownItem {
  id: string | number;
  label: React.ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  label: React.ReactNode;
  items: DropdownItem[];
  icon?: React.ReactNode;
  buttonClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  showChevron?: boolean;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  items,
  icon,
  buttonClassName = '',
  menuClassName = '',
  align = 'left',
  showChevron = true,
  disabled = false,
}: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          disabled={disabled}
          className={`inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${buttonClassName}`}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {showChevron && (
            <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute ${
            align === 'left' ? 'left-0' : 'right-0'
          } z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${menuClassName}`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Fragment key={item.id}>
                <Menu.Item disabled={item.disabled}>
                  {({ active }: { active: boolean }) => {
                    if (item.href) {
                      return (
                        <a
                          href={item.href}
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } ${
                            item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                          } group flex w-full items-center px-4 py-2 text-sm`}
                        >
                          {item.icon && (
                            <span className="mr-3 h-5 w-5">{item.icon}</span>
                          )}
                          {item.label}
                        </a>
                      );
                    }
                    
                    return (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className={`${
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } ${
                          item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        } group flex w-full items-center px-4 py-2 text-sm`}
                      >
                        {item.icon && (
                          <span className="mr-3 h-5 w-5">{item.icon}</span>
                        )}
                        {item.label}
                      </button>
                    );
                  }}
                </Menu.Item>
                {item.divider && index < items.length - 1 && (
                  <div className="my-1 h-px bg-gray-200" />
                )}
              </Fragment>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 