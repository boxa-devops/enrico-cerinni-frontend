/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Built using the design system tokens for consistent styling.
 * 
 * @component
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * @example
 * <Button variant="outline" loading>
 *   Loading...
 * </Button>
 */

'use client';

import { forwardRef, memo } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Button variant styles
 * Each variant provides different visual emphasis levels
 */
const VARIANT_STYLES = {
  // Primary - Main call-to-action buttons
  primary: 'bg-blue-500 text-white shadow-sm hover:bg-blue-600 active:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  
  // Secondary - Secondary actions
  secondary: 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 active:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  
  // Outline - Subtle actions
  outline: 'bg-transparent text-blue-600 border border-blue-300 hover:bg-blue-50 active:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  
  // Ghost - Minimal visual weight
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  
  // Danger - Destructive actions
  danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  
  // Success - Positive actions
  success: 'bg-green-500 text-white shadow-sm hover:bg-green-600 active:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
  
  // Warning - Attention-requiring actions
  warning: 'bg-yellow-500 text-white shadow-sm hover:bg-yellow-600 active:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
};

/**
 * Button size styles
 * Controls padding, text size, and minimum height
 */
const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-sm font-medium min-h-8 rounded-md',
  md: 'px-4 py-2 text-sm font-medium min-h-10 rounded-md',
  lg: 'px-6 py-3 text-base font-medium min-h-12 rounded-lg',
  xl: 'px-8 py-4 text-lg font-medium min-h-14 rounded-lg',
};

/**
 * Button component
 */
const Button = forwardRef(({ 
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  // Handle click events
  const handleClick = (event) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
        'focus:outline-none focus:ring-offset-white',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        
        // Variant styles
        VARIANT_STYLES[variant],
        
        // Size styles
        SIZE_STYLES[size],
        
        // Width styles
        fullWidth && 'w-full',
        
        // Custom className
        className
      )}
      {...props}
    >
      {/* Left icon */}
      {leftIcon && !loading && (
        <span className="flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      {/* Loading spinner */}
      {loading && (
        <Loader2 
          className={cn(
            'animate-spin flex-shrink-0',
            size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
          )} 
          aria-hidden="true" 
        />
      )}
      
      {/* Button content */}
      {children && (
        <span className={cn(
          'truncate',
          loading && 'opacity-70'
        )}>
          {children}
        </span>
      )}
      
      {/* Right icon */}
      {rightIcon && !loading && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default memo(Button);