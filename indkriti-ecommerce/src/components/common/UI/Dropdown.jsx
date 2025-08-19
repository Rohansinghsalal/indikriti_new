import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  trigger,
  children,
  placement = 'bottom-start',
  offset = 8,
  width,
  isOpen: controlledIsOpen,
  onToggle,
  closeOnItemClick = true,
  closeOnOutsideClick = true,
  className = '',
  ...props
}) => {
  const [isOpenState, setIsOpenState] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : isOpenState;
  
  const handleToggle = () => {
    if (isControlled) {
      onToggle && onToggle(!isOpen);
    } else {
      setIsOpenState(!isOpen);
    }
  };
  
  const handleClose = () => {
    if (isControlled) {
      onToggle && onToggle(false);
    } else {
      setIsOpenState(false);
    }
  };
  
  const handleItemClick = () => {
    if (closeOnItemClick) {
      handleClose();
    }
  };
  
  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        closeOnOutsideClick &&
        isOpen &&
        dropdownRef.current &&
        triggerRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };
    
    const handleEscapeKey = (event) => {
      if (isOpen && event.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, closeOnOutsideClick]);
  
  const placementClasses = {
    'top-start': 'dropdown-top-start',
    'top': 'dropdown-top',
    'top-end': 'dropdown-top-end',
    'right-start': 'dropdown-right-start',
    'right': 'dropdown-right',
    'right-end': 'dropdown-right-end',
    'bottom-start': 'dropdown-bottom-start',
    'bottom': 'dropdown-bottom',
    'bottom-end': 'dropdown-bottom-end',
    'left-start': 'dropdown-left-start',
    'left': 'dropdown-left',
    'left-end': 'dropdown-left-end'
  };
  
  const dropdownClasses = [
    'dropdown',
    placementClasses[placement],
    className
  ].filter(Boolean).join(' ');
  
  const menuClasses = [
    'dropdown-menu',
    isOpen ? 'dropdown-menu-open' : ''
  ].filter(Boolean).join(' ');
  
  const menuStyle = {
    '--dropdown-offset': `${offset}px`,
    width: width ? `${width}px` : 'auto'
  };
  
  return (
    <div className={dropdownClasses} ref={dropdownRef} {...props}>
      <div 
        className="dropdown-trigger" 
        ref={triggerRef} 
        onClick={handleToggle}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={menuClasses} 
          style={menuStyle}
          onClick={handleItemClick}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  active = false,
  className = '',
  ...props
}) => {
  const itemClasses = [
    'dropdown-item',
    disabled ? 'dropdown-item-disabled' : '',
    active ? 'dropdown-item-active' : '',
    className
  ].filter(Boolean).join(' ');
  
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };
  
  return (
    <div
      className={itemClasses}
      onClick={handleClick}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownDivider = ({ className = '', ...props }) => {
  const dividerClasses = ['dropdown-divider', className].filter(Boolean).join(' ');
  
  return <div className={dividerClasses} role="separator" {...props} />;
};

const DropdownHeader = ({ children, className = '', ...props }) => {
  const headerClasses = ['dropdown-header', className].filter(Boolean).join(' ');
  
  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  );
};

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;
Dropdown.Header = DropdownHeader;

export { Dropdown, DropdownItem, DropdownDivider, DropdownHeader };
export default Dropdown;