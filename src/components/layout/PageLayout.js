/**
 * PageLayout Component
 * 
 * A consistent page layout wrapper that provides standard spacing, headers, and structure.
 * Used to ensure consistent page layouts across the application.
 * 
 * @component
 * @example
 * <PageLayout
 *   title="Page Title"
 *   subtitle="Page description"
 *   actions={<Button>Action</Button>}
 * >
 *   <div>Page content</div>
 * </PageLayout>
 */

'use client';

import { cn } from '../../utils/cn';
import { Card } from '../ui/Card';

const PageLayout = ({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
  contentClassName,
  maxWidth = '7xl',
  spacing = 'default',
  ...props
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const spacingClasses = {
    none: 'space-y-0',
    sm: 'space-y-3',
    default: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 py-6',
        maxWidthClasses[maxWidth],
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs}
          </ol>
        </nav>
      )}

      {/* Page Header */}
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 truncate">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="flex-shrink-0 flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Page Content */}
      <div className={cn('flex-1', contentClassName)}>
        {children}
      </div>
    </div>
  );
};

// Breadcrumb components
const BreadcrumbItem = ({ children, href, isLast = false, ...props }) => (
  <li className="inline-flex items-center">
    {!isLast && href ? (
      <a
        href={href}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        {...props}
      >
        {children}
      </a>
    ) : (
      <span className="text-sm font-medium text-gray-900" {...props}>
        {children}
      </span>
    )}
    {!isLast && (
      <svg
        className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    )}
  </li>
);

// Page section component for better organization
const PageSection = ({ 
  children, 
  title, 
  subtitle, 
  actions,
  className, 
  variant = 'default',
  ...props 
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    ghost: 'bg-transparent',
    filled: 'bg-gray-50 border border-gray-200',
  };

  return (
    <Card
      className={cn(
        variants[variant],
        className
      )}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="flex-shrink-0 flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {children}
    </Card>
  );
};

PageLayout.BreadcrumbItem = BreadcrumbItem;
PageLayout.Section = PageSection;

export default PageLayout;
