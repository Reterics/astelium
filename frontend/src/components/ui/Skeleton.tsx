import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  count?: number;
  inline?: boolean;
}

/**
 * Skeleton component for loading states
 *
 * @example
 * // Basic usage
 * <Skeleton height="20px" width="100%" />
 *
 * // Circle skeleton
 * <Skeleton circle height={40} width={40} />
 *
 * // Multiple skeletons
 * <Skeleton count={3} height="20px" width="100%" />
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  circle = false,
  count = 1,
  inline = false,
}) => {
  const baseClass = 'animate-pulse bg-zinc-200 dark:bg-zinc-700';
  const radiusClass = circle ? 'rounded-full' : 'rounded-md';
  const inlineClass = inline ? 'inline-block' : 'block';

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <span
            key={i}
            className={`${baseClass} ${radiusClass} ${inlineClass} ${className}`}
            style={style}
            aria-hidden='true'
          />
        ))}
    </>
  );
};

export default Skeleton;

export const SkeletonText: React.FC<{lines?: number; className?: string}> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            height='1rem'
            width={i === lines - 1 && lines > 1 ? '80%' : '100%'}
          />
        ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{className?: string}> = ({
  className = '',
}) => {
  return (
    <div className={`border border-zinc-200 rounded-md p-4 ${className}`}>
      <div className='flex items-center space-x-3 mb-4'>
        <Skeleton circle width={40} height={40} />
        <div className='space-y-2 flex-1'>
          <Skeleton height='0.875rem' width='60%' />
          <Skeleton height='0.75rem' width='40%' />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({rows = 5, columns = 4, className = ''}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className='grid grid-cols-12 gap-4 mb-2'>
        {Array(columns)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={`col-span-${Math.floor(12 / columns)}`}>
              <Skeleton height='1.25rem' width='80%' />
            </div>
          ))}
      </div>

      {Array(rows)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className='grid grid-cols-12 gap-4 py-2 border-b border-zinc-100'
          >
            {Array(columns)
              .fill(0)
              .map((_, j) => (
                <div key={j} className={`col-span-${Math.floor(12 / columns)}`}>
                  <Skeleton
                    height='1rem'
                    width={`${Math.floor(Math.random() * 40) + 60}%`}
                  />
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};
