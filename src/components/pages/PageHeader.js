/**
 * PageHeader Component
 * 
 * A flexible page header component with title, subtitle, breadcrumbs, and action buttons.
 * Provides consistent styling and layout for page headers across the application.
 * 
 * @component
 * @example
 * <PageHeader
 *   title="Page Title"
 *   subtitle="Page description"
 *   breadcrumbs={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Current Page' }
 *   ]}
 *   actions={[
 *     { 
 *       label: 'Add Item', 
 *       icon: 'plus', 
 *       onClick: handleAdd,
 *       variant: 'primary'
 *     }
 *   ]}
 * />
 */

'use client';

import { 
  Plus, 
  Download, 
  Upload, 
  Filter, 
  Search, 
  Settings, 
  MoreHorizontal,
  ChevronRight 
} from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../utils/cn';

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [],
  actions = [], 
  className,
  children,
  ...props 
}) => {
  // Icon mapping for actions
  const getActionIcon = (iconName) => {
    const iconMap = {
      plus: Plus,
      download: Download,
      upload: Upload,
      filter: Filter,
      search: Search,
      settings: Settings,
      more: MoreHorizontal,
    };
    
    return iconMap[iconName] || null;
  };

  return (
    <div 
      className={cn(
        'flex flex-col gap-4 mb-6',
        className
      )}
      {...props}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                )}
                {crumb.href ? (
                  <a 
                    href={crumb.href}
                    className="hover:text-gray-700 transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title Section */}
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
        
        {/* Actions Section */}
        {(actions.length > 0 || children) && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Custom children (additional content) */}
            {children}
            
            {/* Action buttons */}
            {actions.map((action, index) => {
              const Icon = getActionIcon(action.icon);
              
              return (
                <Button
                  key={action.key || index}
                  variant={action.variant || 'primary'}
                  size={action.size || 'md'}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  loading={action.loading}
                  leftIcon={Icon && <Icon className="h-4 w-4" />}
                  className={action.className}
                  {...action.props}
                >
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Breadcrumb item helper component
export const BreadcrumbItem = ({ label, href, isLast = false }) => ({
  label,
  href: !isLast ? href : undefined,
});

export default PageHeader; 