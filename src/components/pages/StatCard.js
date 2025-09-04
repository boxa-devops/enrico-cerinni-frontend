/**
 * StatCard Component
 * 
 * A flexible statistics card component for displaying key metrics with optional trends.
 * Supports multiple value formats and customizable styling.
 * 
 * @component
 * @example
 * <StatCard
 *   title="Total Sales"
 *   value={125000}
 *   icon={DollarSign}
 *   format="currency"
 *   trend="up"
 *   trendValue="12%"
 *   variant="success"
 * />
 */

'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/format';
import { Card } from '../ui';
import { cn } from '../../utils/cn';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  trendLabel,
  format = 'number',
  currency = 'UZS',
  variant = 'default',
  size = 'default',
  loading = false,
  onClick,
  className,
  ...props 
}) => {
  // Format the display value
  const formatValue = (val) => {
    if (loading || val === null || val === undefined) {
      return '---';
    }

    switch (format) {
      case 'currency':
        return formatCurrency(val, currency);
      case 'number':
        return formatNumber(val);
      case 'percentage':
        return `${val}%`;
      case 'decimal':
        return Number(val).toFixed(2);
      default:
        return val;
    }
  };

  // Get trend icon and color
  const getTrendDisplay = () => {
    if (!trend || !trendValue) return null;

    const trendConfig = {
      up: {
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      down: {
        icon: TrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
      neutral: {
        icon: Minus,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
      },
    };

    const config = trendConfig[trend] || trendConfig.neutral;
    const TrendIcon = config.icon;

    return (
      <div className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        config.color,
        config.bgColor
      )}>
        <TrendIcon className="h-3 w-3" />
        <span>{trendValue}</span>
      </div>
    );
  };

  // Variant styles
  const variantStyles = {
    default: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    success: {
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    warning: {
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    danger: {
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    info: {
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  // Size styles
  const sizeStyles = {
    sm: {
      padding: 'p-4',
      iconSize: 'w-8 h-8',
      iconSvgSize: 'h-4 w-4',
      titleSize: 'text-xs',
      valueSize: 'text-lg',
    },
    default: {
      padding: 'p-6',
      iconSize: 'w-10 h-10',
      iconSvgSize: 'h-5 w-5',
      titleSize: 'text-sm',
      valueSize: 'text-2xl',
    },
    lg: {
      padding: 'p-8',
      iconSize: 'w-12 h-12',
      iconSvgSize: 'h-6 w-6',
      titleSize: 'text-base',
      valueSize: 'text-3xl',
    },
  };

  const sizeConfig = sizeStyles[size] || sizeStyles.default;

  return (
    <Card
      className={cn(
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md',
        loading && 'animate-pulse',
        className
      )}
      padding="none"
      onClick={onClick}
      {...props}
    >
      <div className={sizeConfig.padding}>
        {/* Header with icon and trend */}
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            'flex items-center justify-center rounded-lg shrink-0',
            sizeConfig.iconSize,
            styles.iconBg
          )}>
            {Icon && (
              <Icon className={cn(sizeConfig.iconSvgSize, styles.iconColor)} />
            )}
          </div>
          {getTrendDisplay()}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className={cn(
            'font-medium text-gray-500 uppercase tracking-wide leading-tight',
            sizeConfig.titleSize
          )}>
            {title}
          </h3>
          
          <p className={cn(
            'font-bold text-gray-900 leading-tight',
            sizeConfig.valueSize,
            loading && 'bg-gray-200 rounded animate-pulse'
          )}>
            {formatValue(value)}
          </p>

          {/* Trend label */}
          {trendLabel && (
            <p className="text-xs text-gray-500 mt-1">
              {trendLabel}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// Skeleton version for loading states
export const StatCardSkeleton = ({ size = 'default', className }) => {
  const sizeConfig = {
    sm: 'p-4',
    default: 'p-6', 
    lg: 'p-8',
  };

  return (
    <Card className={cn('animate-pulse', className)} padding="none">
      <div className={sizeConfig[size] || sizeConfig.default}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-12 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="w-20 h-3 bg-gray-200 rounded"></div>
          <div className="w-24 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard; 