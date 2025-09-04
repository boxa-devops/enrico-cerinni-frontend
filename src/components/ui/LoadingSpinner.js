/**
 * LoadingSpinner Component
 * 
 * A reusable loading spinner component with customizable size, color, and message.
 * Provides visual feedback during async operations.
 * 
 * @component
 * @example
 * <LoadingSpinner size="lg" message="Loading data..." />
 */

'use client';

import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  message = 'Yuklanmoqda...', 
  size = 'md',
  color = 'blue',
  className,
  messageClassName,
  inline = false,
  ...props 
}) => {
  // Size configurations
  const sizeClasses = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-2',
    xl: 'h-12 w-12 border-2',
    // Legacy support
    small: 'h-4 w-4 border',
    medium: 'h-6 w-6 border-2',
    large: 'h-8 w-8 border-2',
  };

  // Color configurations
  const colorClasses = {
    blue: 'border-gray-200 border-t-blue-500',
    green: 'border-gray-200 border-t-green-500',
    red: 'border-gray-200 border-t-red-500',
    yellow: 'border-gray-200 border-t-yellow-500',
    purple: 'border-gray-200 border-t-purple-500',
    gray: 'border-gray-200 border-t-gray-500',
  };

  const Spinner = () => (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label={message || 'Loading'}
      {...props}
    >
      <span className="sr-only">{message || 'Loading...'}</span>
    </div>
  );

  // Inline variant - just the spinner
  if (inline) {
    return <Spinner />;
  }

  // Full variant with message
  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4 min-h-[200px]">
      <Spinner />
      {message && (
        <p className={cn(
          'text-sm text-gray-600 text-center max-w-xs',
          messageClassName
        )}>
          {message}
        </p>
      )}
    </div>
  );
};

// Skeleton component for content placeholders
export const Skeleton = ({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  ...props 
}) => {
  const variants = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variants[variant],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      {...props}
    />
  );
};

// Loading dots component
export const LoadingDots = ({ 
  className,
  size = 'md',
  color = 'gray',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  const colorClasses = {
    gray: 'bg-gray-400',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className={cn('flex space-x-1', className)} {...props}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner; 