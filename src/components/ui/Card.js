/**
 * Card Component
 * 
 * A flexible container component that provides consistent styling for content blocks.
 * Used throughout the application for grouping related content.
 * 
 * @component
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     Content goes here
 *   </CardContent>
 * </Card>
 */

'use client';

import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

// Main Card component
const Card = forwardRef(({ 
  className, 
  children, 
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  hover = false,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    ghost: 'bg-transparent',
    outlined: 'bg-white border-2 border-gray-300',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg',
        variants[variant],
        paddings[padding],
        shadows[shadow],
        hover && 'transition-shadow duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header component
const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

// Card Title component
const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

// Card Description component
const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

// Card Content component
const CardContent = forwardRef(({ className, children, padding = 'none', ...props }, ref) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      ref={ref}
      className={cn(paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

// Card Footer component
const CardFooter = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
