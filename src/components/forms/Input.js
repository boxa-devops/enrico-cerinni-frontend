/**
 * Input Component
 * 
 * A flexible form input component with built-in validation, labels, and error states.
 * Supports various input types and provides consistent styling across the application.
 * 
 * @component
 * @example
 * <Input
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 *   error={errors.email}
 *   onChange={handleChange}
 * />
 */

'use client';

import React, { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({ 
  // Input props
  type = 'text',
  className,
  
  // Label props
  label,
  required = false,
  
  // State props
  error,
  disabled = false,
  
  // Visual props
  size = 'md',
  variant = 'default',
  
  // Icon props
  leftIcon,
  rightIcon,
  icon: Icon, // Legacy support
  
  // Placeholder and helper text
  placeholder,
  helperText,
  
  // Event handlers
  onChange,
  onFocus,
  onBlur,
  
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const generatedId = useId();
  const inputId = props.id || `input-${generatedId}`;
  
  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle focus events
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Determine input type (handle password visibility)
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const isTextarea = type === 'textarea';

  // Legacy icon support
  const actualLeftIcon = leftIcon || Icon;

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-8',
    md: 'px-3 py-2 text-sm min-h-10',
    lg: 'px-4 py-3 text-base min-h-12',
  };

  // Visual variants
  const variantClasses = {
    default: cn(
      'border-gray-300 bg-white',
      'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    ),
    ghost: cn(
      'border-transparent bg-gray-50',
      'focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-blue-500/20',
      error && 'bg-red-50 focus:border-red-500 focus:ring-red-500/20'
    ),
  };

  const inputClasses = cn(
    // Base styles
    'w-full rounded-lg border transition-all duration-200',
    'placeholder:text-gray-400',
    'focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
    
    // Size styles
    sizeClasses[size],
    
    // Variant styles
    variantClasses[variant],
    
    // Icon spacing
    actualLeftIcon && 'pl-10',
    (rightIcon || type === 'password') && 'pr-10',
    
    // Custom className
    className
  );

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {actualLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {React.isValidElement(actualLeftIcon) ? (
              actualLeftIcon
            ) : typeof actualLeftIcon === 'function' ? (
              <actualLeftIcon className="h-4 w-4" />
            ) : null}
          </div>
        )}

        {/* Input field or textarea */}
        {isTextarea ? (
          <textarea
            ref={ref}
            id={inputId}
            disabled={disabled}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(inputClasses, 'min-h-20 resize-y')}
            rows={4}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              cn(
                error && `${inputId}-error`,
                helperText && `${inputId}-helper`
              )
            }
            {...props}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              cn(
                error && `${inputId}-error`,
                helperText && `${inputId}-helper`
              )
            }
            {...props}
          />
        )}

        {/* Right icon or password toggle */}
        {!isTextarea && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {type === 'password' ? (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            ) : rightIcon ? (
              <div className="text-gray-400 pointer-events-none">
                {rightIcon}
              </div>
            ) : error ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Helper text */}
      {helperText && !error && (
        <p 
          className="mt-1 text-xs text-gray-500"
          id={`${inputId}-helper`}
        >
          {helperText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p 
          className="mt-1 text-xs text-red-600 flex items-center gap-1"
          id={`${inputId}-error`}
          role="alert"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {typeof error === 'string' ? error : 'Invalid input'}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 