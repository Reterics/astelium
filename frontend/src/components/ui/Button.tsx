import React from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive'
  | 'subtle'
  | 'gradient';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';

type ButtonRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  elevated?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      rounded = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      elevated = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes - common to all buttons
    const baseClasses = `
      inline-flex items-center justify-center font-medium
      transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
      select-none
    `;

    // Variant classes - specific to each button type
    const variantClasses = {
      primary: `
        bg-blue-600 text-white
        hover:bg-blue-700
        active:bg-blue-800 active:scale-[0.98]
        focus:ring-blue-500
        disabled:bg-blue-400
      `,
      secondary: `
        bg-zinc-200 text-zinc-800
        hover:bg-zinc-300
        active:bg-zinc-400 active:scale-[0.98]
        focus:ring-zinc-400
        disabled:bg-zinc-200 disabled:text-zinc-500
      `,
      outline: `
        bg-white text-zinc-800 border border-zinc-300
        hover:bg-zinc-50 hover:border-zinc-400
        active:bg-zinc-100 active:scale-[0.98]
        focus:ring-zinc-400
        disabled:bg-white disabled:text-zinc-400 disabled:border-zinc-200
      `,
      ghost: `
        bg-transparent text-zinc-700
        hover:bg-zinc-100
        active:bg-zinc-200 active:scale-[0.98]
        focus:ring-zinc-400
        disabled:text-zinc-400 disabled:bg-transparent
      `,
      link: `
        bg-transparent text-blue-600 underline-offset-4
        hover:underline hover:text-blue-700
        active:text-blue-800
        focus:ring-blue-500
        disabled:text-blue-400
        p-0 h-auto
      `,
      destructive: `
        bg-red-600 text-white
        hover:bg-red-700
        active:bg-red-800 active:scale-[0.98]
        focus:ring-red-500
        disabled:bg-red-400
      `,
      subtle: `
        bg-blue-50 text-blue-700
        hover:bg-blue-100
        active:bg-blue-200 active:scale-[0.98]
        focus:ring-blue-400
        disabled:bg-blue-50 disabled:text-blue-400
      `,
      gradient: `
        bg-gradient-to-r from-blue-600 to-indigo-600 text-white
        hover:from-blue-700 hover:to-indigo-700
        active:from-blue-800 active:to-indigo-800 active:scale-[0.98]
        focus:ring-blue-500
        disabled:from-blue-400 disabled:to-indigo-400
      `,
    };

    // Size classes - control dimensions and padding
    const sizeClasses = {
      xs: 'h-7 px-2.5 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-5 text-base',
      xl: 'h-12 px-6 text-base',
      icon: 'w-10 h-10 p-2',
    };

    // Rounded corner classes
    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Elevation classes (shadow)
    const elevationClasses = elevated ? 'shadow-md hover:shadow-lg' : '';

    // Loading state
    const loadingElement = isLoading ? (
      <span className={size === 'icon' ? '' : 'mr-2'}>
        <svg
          className="animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          width={size === 'xs' || size === 'sm' ? 16 : 20}
          height={size === 'xs' || size === 'sm' ? 16 : 20}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
    ) : null;

    // Icon spacing based on size
    const iconSpacing = {
      xs: 'mr-1.5',
      sm: 'mr-1.5',
      md: 'mr-2',
      lg: 'mr-2.5',
      xl: 'mr-3',
      icon: '',
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${roundedClasses[rounded]}
          ${widthClasses}
          ${elevationClasses}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && loadingElement}
        {!isLoading && leftIcon && (
          <span className={size === 'icon' ? '' : iconSpacing[size]}>
            {leftIcon}
          </span>
        )}
        {size === 'icon' ? null : children}
        {!isLoading && rightIcon && (
          <span className={size === 'icon' ? '' : `ml-${iconSpacing[size].substring(3)}`}>
            {rightIcon}
          </span>
        )}
        {size === 'icon' && !isLoading && children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
