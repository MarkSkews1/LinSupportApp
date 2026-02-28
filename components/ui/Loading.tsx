import React from 'react';
import { cn } from '@/lib/utils';

const Loading = ({ className, size = 'default' }: { className?: string; size?: 'sm' | 'default' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-blue-600 border-t-transparent',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      {...props}
    />
  );
};

export { Loading, Skeleton };

