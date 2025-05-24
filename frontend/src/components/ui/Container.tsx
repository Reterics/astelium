import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className = '',
      size = 'lg',
      padding = 'md',
      centered = true,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
    };

    const paddingClasses = {
      none: 'px-0',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    };

    const centeredClasses = centered ? 'mx-auto' : '';

    return (
      <div
        ref={ref}
        className={`w-full ${sizeClasses[size]} ${paddingClasses[padding]} ${centeredClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export {Container};
export type {ContainerProps};
